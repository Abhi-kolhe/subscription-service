const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

// Helper to calculate endDate based on plan duration (in days)
function calculateEndDate(duration) {
  const now = new Date();
  now.setDate(now.getDate() + duration);
  return now;
}

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { planId } = req.body;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ msg: 'Plan not found' });
    }

    // Expire any active subscriptions for this user
    await Subscription.updateMany(
      { userId, status: 'ACTIVE' },
      { status: 'EXPIRED' }
    );

    // Create new subscription
    const subscription = new Subscription({
      userId,
      planId,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: calculateEndDate(plan.duration)
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// Retrieve a user's current subscription, auto-expiring if needed
exports.getSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    // Only allow access if user is self (or add admin logic)
    if (userId !== req.user.userId) {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    // Get latest subscription
    const subscription = await Subscription.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate('planId')
      .lean();
    if (!subscription) {
      return res.status(404).json({ msg: 'No subscription found' });
    }

    // Check for expiry
    if (
      subscription.status === 'ACTIVE' &&
      new Date(subscription.endDate) < new Date()
    ) {
      await Subscription.findByIdAndUpdate(subscription._id, { status: 'EXPIRED' });
      subscription.status = 'EXPIRED';
    }

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// Update a user's subscription plan
exports.updateSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { planId } = req.body;
    if (userId !== req.user.userId) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ msg: 'Plan not found' });
    }

    // Get current active subscription
    const subscription = await Subscription.findOne({ userId, status: 'ACTIVE' });
    if (!subscription) {
      return res.status(404).json({ msg: 'No active subscription found' });
    }

    // Update plan and endDate
    subscription.planId = planId;
    subscription.endDate = calculateEndDate(plan.duration);
    await subscription.save();

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// Cancel a subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.userId) {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    // Get current active subscription
    const subscription = await Subscription.findOne({ userId, status: 'ACTIVE' });
    if (!subscription) {
      return res.status(404).json({ msg: 'No active subscription found' });
    }

    subscription.status = 'CANCELLED';
    await subscription.save();

    res.json({ msg: 'Subscription cancelled', subscription });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};
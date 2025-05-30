const Plan = require('../models/Plan');

// Create a new subscription plan
exports.createPlan = async (req, res) => {
  try {
    const { name, price, features, duration } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ message: 'Name, price, and duration are required.' });
    }
    const plan = new Plan({ name, price, features, duration });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all subscription plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
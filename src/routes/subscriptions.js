const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription
} = require('../controllers/subscriptionController');

// All routes below are protected by JWT middleware

// Create a new subscription
router.post(
  '/',
  auth,
  [
    body('planId').isMongoId().withMessage('A valid planId is required')
  ],
  createSubscription
);

// Get a user's current subscription
router.get(
  '/:userId',
  auth,
  [
    param('userId').isMongoId().withMessage('A valid userId is required')
  ],
  getSubscription
);

// Update a user's subscription
router.put(
  '/:userId',
  auth,
  [
    param('userId').isMongoId().withMessage('A valid userId is required'),
    body('planId').isMongoId().withMessage('A valid planId is required')
  ],
  updateSubscription
);

// Cancel a user's subscription
router.delete(
  '/:userId',
  auth,
  [
    param('userId').isMongoId().withMessage('A valid userId is required')
  ],
  cancelSubscription
);

module.exports = router;
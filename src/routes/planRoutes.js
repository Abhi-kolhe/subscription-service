const express = require('express');
const router = express.Router();

const planController = require('../controllers/planController');

// POST /plans - Create a new plan
router.post('/', planController.createPlan);

// GET /plans - List all plans
router.get('/', planController.getPlans);

module.exports = router;
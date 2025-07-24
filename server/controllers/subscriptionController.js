const Subscription = require('../models/Subscription');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Subscribe to newsletter
// @route   POST /api/v1/subscribe
// @access  Public
exports.subscribe = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Check if email already exists
  const existingSubscription = await Subscription.findOne({ email });
  
  if (existingSubscription) {
    return res.status(200).json({
      success: true,
      message: 'Email is already subscribed to our newsletter.',
    });
  }

  const subscription = await Subscription.create({ email });

  res.status(201).json({
    success: true,
    data: subscription,
    message: 'Thank you for subscribing to our newsletter!',
  });
});

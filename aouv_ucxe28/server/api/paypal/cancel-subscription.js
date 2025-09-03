// Backend API endpoint for cancelling PayPal subscriptions
const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const router = express.Router();

// PayPal environment setup
const environment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

router.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const request = new paypal.subscriptions.SubscriptionsCancelRequest(subscriptionId);
    request.requestBody({
      reason: 'User requested cancellation'
    });

    await client.execute(request);
    
    // Update your database to mark subscription as cancelled
    // TODO: Update subscription status in your database
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling PayPal subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription',
      details: error.message 
    });
  }
});

module.exports = router;

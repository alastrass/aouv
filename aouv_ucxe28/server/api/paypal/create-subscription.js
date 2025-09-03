// Backend API endpoint for creating PayPal subscriptions
const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const router = express.Router();

// PayPal environment setup
const environment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

// First, you need to create a subscription plan (this would be done once)
async function createSubscriptionPlan() {
  const request = new paypal.subscriptions.PlansCreateRequest();
  request.requestBody({
    product_id: 'PROD-PREMIUM-WEEKLY', // You need to create this product first
    name: 'Premium Weekly Subscription',
    description: 'Weekly premium access to all content',
    status: 'ACTIVE',
    billing_cycles: [{
      frequency: {
        interval_unit: 'WEEK',
        interval_count: 1
      },
      tenure_type: 'REGULAR',
      sequence: 1,
      total_cycles: 0, // 0 means infinite
      pricing_scheme: {
        fixed_price: {
          value: '2.99',
          currency_code: 'EUR'
        }
      }
    }],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: {
        value: '0',
        currency_code: 'EUR'
      },
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3
    }
  });

  try {
    const plan = await client.execute(request);
    return plan.result.id;
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    throw error;
  }
}

router.post('/create-subscription', async (req, res) => {
  try {
    const { planId } = req.body;
    
    // Use existing plan ID or create a new one
    const subscriptionPlanId = planId || await createSubscriptionPlan();

    const request = new paypal.subscriptions.SubscriptionsCreateRequest();
    request.requestBody({
      plan_id: subscriptionPlanId,
      start_time: new Date(Date.now() + 60000).toISOString(), // Start in 1 minute
      subscriber: {
        name: {
          given_name: 'Premium',
          surname: 'User'
        }
      },
      application_context: {
        brand_name: 'Le Temple des Plaisirs',
        locale: 'fr-FR',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        },
        return_url: `${process.env.FRONTEND_URL}/subscription/success`,
        cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`
      }
    });

    const subscription = await client.execute(request);
    
    res.json({
      subscriptionID: subscription.result.id,
      status: subscription.result.status,
      approvalUrl: subscription.result.links.find(link => link.rel === 'approve')?.href
    });
  } catch (error) {
    console.error('Error creating PayPal subscription:', error);
    res.status(500).json({ 
      error: 'Failed to create subscription',
      details: error.message 
    });
  }
});

module.exports = router;

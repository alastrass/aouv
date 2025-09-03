// Backend API endpoint for capturing PayPal orders
const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const router = express.Router();

// PayPal environment setup (same as create-order.js)
const environment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

router.post('/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);
    
    // Here you would typically:
    // 1. Verify the payment was successful
    // 2. Update your database with the purchase
    // 3. Unlock content for the user
    // 4. Send confirmation email
    
    if (capture.result.status === 'COMPLETED') {
      // Save purchase to database
      const purchaseData = {
        orderID: capture.result.id,
        payerID: capture.result.payer.payer_id,
        amount: capture.result.purchase_units[0].payments.captures[0].amount.value,
        currency: capture.result.purchase_units[0].payments.captures[0].amount.currency_code,
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      // TODO: Save to your database
      console.log('Purchase completed:', purchaseData);
      
      res.json({
        success: true,
        orderID: capture.result.id,
        status: capture.result.status,
        details: capture.result
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed',
        status: capture.result.status
      });
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ 
      error: 'Failed to capture order',
      details: error.message 
    });
  }
});

module.exports = router;

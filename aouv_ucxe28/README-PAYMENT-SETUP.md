# PayPal Payment Integration Setup Guide

This guide will help you set up the complete PayPal payment system for your game application.

## Prerequisites

1. **PayPal Developer Account**: Create an account at [developer.paypal.com](https://developer.paypal.com/)
2. **PayPal App**: Create a new app in your PayPal Developer Dashboard
3. **Database**: PostgreSQL database for storing user and payment data
4. **Backend Server**: Node.js/Express server for handling PayPal API calls

## Setup Steps

### 1. PayPal Configuration

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/developer/applications/)
2. Create a new app
3. Get your **Client ID** and **Client Secret**
4. Copy `.env.example` to `.env` and add your credentials:

```env
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
VITE_API_URL=http://localhost:3001
```

### 2. Database Setup

1. Create a PostgreSQL database
2. Run the schema from `server/database/schema.sql`
3. The schema includes tables for:
   - Users and authentication
   - Subscription plans and user subscriptions
   - Content packs and purchases
   - Payment transaction logs

### 3. Backend Server Setup

Install required dependencies:

```bash
npm install express @paypal/checkout-server-sdk cors dotenv
```

Create your Express server with the provided API endpoints:
- `/api/paypal/create-order` - Creates PayPal orders for one-time purchases
- `/api/paypal/capture-order` - Captures completed payments
- `/api/paypal/create-subscription` - Creates recurring subscriptions
- `/api/paypal/cancel-subscription` - Cancels active subscriptions

### 4. Frontend Integration

The frontend is already configured with:
- **PaymentStore Component**: Complete store interface for browsing and purchasing
- **usePayPal Hook**: Handles all PayPal SDK interactions
- **Payment Types**: TypeScript interfaces for all payment-related data
- **Content Management**: System for managing and unlocking content packs

## Features Implemented

### Payment Options

1. **Lifetime Purchase** (€19.99)
   - One-time payment for permanent access
   - Unlocks all current and future content
   - No recurring charges

2. **Premium Weekly Subscription** (€2.99/week)
   - Recurring weekly billing
   - Access to all premium features
   - Can be cancelled anytime

3. **Themed Content Packs** (€3.99 - €6.99 each)
   - Individual purchasable expansions
   - 50 questions + 50 actions per pack
   - Themes: Voyeur, Outdoor, Exhibition, Hands-free, Romantic, Kinky

### Content Pack Themes

Each pack contains exactly 100 challenges (50 truths + 50 dares):

- **Voyeur Pack** (€4.99) - Intense difficulty
- **Outdoor Pack** (€4.99) - Intense difficulty  
- **Exhibition Pack** (€5.99) - Extreme difficulty
- **Hands-free Pack** (€4.99) - Intense difficulty
- **Romantic Pack** (€3.99) - Soft difficulty
- **Kinky Pack** (€6.99) - Extreme difficulty

### Security Features

- Secure PayPal SDK integration
- Server-side payment verification
- Purchase validation and content unlocking
- Transaction logging and audit trail
- Error handling for failed payments

### User Experience

- Clean, intuitive store interface
- Preview content for each pack
- Purchase status tracking
- Subscription management
- Responsive design for all devices

## Testing

1. Use PayPal Sandbox for testing
2. Create test accounts in PayPal Developer Dashboard
3. Test all payment flows:
   - One-time purchases
   - Subscription creation and cancellation
   - Content unlocking
   - Error scenarios

## Production Deployment

1. Switch to PayPal Live environment
2. Update environment variables with live credentials
3. Ensure HTTPS is enabled
4. Set up proper error monitoring
5. Configure webhook endpoints for payment notifications

## Support

For PayPal integration issues:
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal SDK for Node.js](https://github.com/paypal/Checkout-NodeJS-SDK)

## Security Considerations

- Never expose PayPal Client Secret in frontend code
- Always validate payments on the server side
- Use HTTPS in production
- Implement proper user authentication
- Log all payment transactions for audit purposes
- Handle PCI compliance requirements

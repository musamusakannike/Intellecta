# Intellecta Premium Payment System

This document outlines the premium payment system implementation using Flutterwave v3 for Nigerian users.

## Overview

The payment system allows users to upgrade to premium access for ₦3,000 for 12 months, providing access to premium features and content.

## Features

- **Flutterwave v3 Integration**: Secure payment processing
- **Premium Access Management**: Automatic premium status updates
- **Payment History**: Track all payment transactions
- **Webhook Support**: Real-time payment status updates
- **Premium Feature Access**: Middleware for protecting premium content

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Flutterwave Configuration
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_SECRET_HASH=your_flutterwave_secret_hash

# Frontend URL for payment redirects
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Payment Routes (`/api/payments`)

#### Initialize Premium Payment
- **POST** `/premium/initiate`
- **Authentication**: Required
- **Body**: 
  ```json
  {
    "duration": 12 // Optional, defaults to 12 months
  }
  ```
- **Response**: Payment link and transaction details

#### Verify Payment
- **GET** `/verify`
- **Query Parameters**: 
  - `tx_ref`: Transaction reference (required)
  - `transaction_id`: Flutterwave transaction ID (optional)
- **Response**: Payment verification status

#### Get Premium Status
- **GET** `/premium/status`
- **Authentication**: Required
- **Response**: Current premium status and expiry details

#### Get Payment History
- **GET** `/history`
- **Authentication**: Required
- **Query Parameters**: 
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**: Paginated payment history

#### Cancel Payment
- **PUT** `/cancel/:transactionId`
- **Authentication**: Required
- **Response**: Cancellation confirmation

#### Flutterwave Webhook
- **POST** `/webhook`
- **Authentication**: Not required (webhook signature verification)
- **Body**: Flutterwave webhook payload

### User Routes (`/api/users`)

#### Check Premium Access
- **GET** `/premium/access`
- **Authentication**: Required
- **Response**: Premium access status

#### Get Premium Features
- **GET** `/premium/features`
- **Authentication**: Required
- **Response**: List of premium features and pricing

## Premium Features

The system includes the following premium features:

1. **Unlimited Course Access** - Access to all premium courses
2. **Ad-Free Experience** - No advertisements during learning
3. **Offline Downloads** - Download courses for offline learning
4. **Priority Support** - Priority customer support
5. **Advanced Analytics** - Detailed progress tracking
6. **Early Access** - Early access to new features

## Middleware

### Premium Access Middleware

Use the premium middleware to protect premium content:

```javascript
const { requirePremium, checkPremiumOptional } = require('./middleware/premium.middleware');

// Require premium access (blocks non-premium users)
router.get('/premium-content', authenticate, requirePremium, controller);

// Optional premium check (doesn't block, but adds premium info)
router.get('/content', authenticate, checkPremiumOptional, controller);
```

## Database Models

### Payment Model
- Tracks all payment transactions
- Links payments to users
- Stores Flutterwave transaction details
- Manages payment status and metadata

### User Model Updates
- `isPremium`: Boolean flag for premium status
- `premiumExpiryDate`: Date when premium expires

## Payment Flow

1. **Initiation**: User requests premium upgrade
2. **Flutterwave**: System creates payment link via Flutterwave
3. **Payment**: User completes payment on Flutterwave
4. **Verification**: System verifies payment via webhook/API
5. **Upgrade**: User premium status is updated automatically
6. **Access**: User gains access to premium features

## Security Features

- Webhook signature verification
- Transaction amount validation
- Duplicate payment prevention
- Secure environment variable management
- Premium access middleware

## Testing

### Test Payment Flow

1. Set up Flutterwave test keys in environment variables
2. Use test card details provided by Flutterwave
3. Monitor webhook calls for payment completion
4. Verify premium status updates correctly

### Test Cards (Flutterwave Sandbox)

```
Card Number: 4187427415564246
CVV: 828
Expiry: 09/32
PIN: 3310
```

## Webhook Configuration

Configure your Flutterwave webhook URL to:
```
https://yourdomain.com/api/payments/webhook
```

Ensure the webhook URL is publicly accessible and uses HTTPS in production.

## Error Handling

The system includes comprehensive error handling for:
- Payment initialization failures
- Network connectivity issues
- Invalid payment amounts
- Expired premium subscriptions
- Webhook verification failures

## Monitoring

Monitor the following:
- Payment success/failure rates
- Premium subscription renewals
- Webhook delivery success
- User upgrade patterns

## Support

For payment-related issues:
1. Check payment history via API
2. Verify webhook delivery
3. Contact Flutterwave support for payment gateway issues
4. Check system logs for detailed error information

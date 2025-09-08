const Flutterwave = require('flutterwave-node-v3');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const { error, success } = require('../util/response.util');
const crypto = require('crypto');

// Initialize Flutterwave
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// Constants
const PREMIUM_PRICE = 3000; // 3000 Naira
const PREMIUM_DURATION_MONTHS = 12; // 12 months

// Generate unique transaction reference
const generateTransactionRef = () => {
  return `INTELLECTA_PREMIUM_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

// Initialize premium payment
const initiatePremiumPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { duration = 12 } = req.body; // Allow custom duration, default to 12 months

    // Check if user is already premium
    const user = await User.findById(userId);
    if (!user) {
      return error({ res, message: 'User not found', statusCode: 404 });
    }

    // Check if user is already premium and not expired
    if (user.isPremium && user.premiumExpiryDate && user.premiumExpiryDate > new Date()) {
      return error({ res, message: 'You already have an active premium subscription', statusCode: 400 });
    }

    const amount = PREMIUM_PRICE;
    const transactionId = generateTransactionRef();

    // Create payment record
    const paymentRecord = new Payment({
      user: userId,
      transactionId,
      amount,
      currency: 'NGN',
      paymentType: 'premium_upgrade',
      premiumDuration: duration,
      status: 'pending',
      metadata: {
        userEmail: user.email,
        userName: user.name,
        premiumDuration: duration
      }
    });

    await paymentRecord.save();

    // Prepare Flutterwave payload
    const payload = {
      tx_ref: transactionId,
      amount: amount,
      currency: 'NGN',
      redirect_url: `${process.env.FRONTEND_URL}/payment/verify?tx_ref=${transactionId}`,
      meta: {
        consumer_id: userId.toString(),
        payment_type: 'premium_upgrade',
        premium_duration: duration
      },
      customer: {
        email: user.email,
        phonenumber: user.phoneNumber || '',
        name: user.name,
      },
      customizations: {
        title: 'Intellecta Premium Upgrade',
        description: `Premium subscription for ${duration} month(s)`,
        logo: `${process.env.FRONTEND_URL}/logo.png`,
      },
    };

    // Initialize payment with Flutterwave
    const response = await flw.StandardSubaccount.charge(payload);

    if (response.status === 'success') {
      return success({
        res,
        message: 'Payment initialized successfully',
        data: {
          paymentLink: response.data.link,
          transactionId: transactionId,
          amount: amount,
          currency: 'NGN',
          duration: duration
        }
      });
    } else {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { transactionId },
        { status: 'failed', metadata: { ...paymentRecord.metadata, error: response.message } }
      );

      return error({ res, message: 'Failed to initialize payment', statusCode: 400 });
    }

  } catch (err) {
    console.error('Payment initialization error:', err);
    return error({ res, message: err?.message || 'Failed to initialize payment' });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { tx_ref, transaction_id } = req.query;

    if (!tx_ref) {
      return error({ res, message: 'Transaction reference is required', statusCode: 400 });
    }

    // Find payment record
    const paymentRecord = await Payment.findOne({ transactionId: tx_ref }).populate('user');
    if (!paymentRecord) {
      return error({ res, message: 'Payment record not found', statusCode: 404 });
    }

    // Verify payment with Flutterwave
    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.data.status === 'successful' && response.data.amount >= PREMIUM_PRICE && response.data.currency === 'NGN') {
      // Update payment record
      paymentRecord.status = 'completed';
      paymentRecord.flutterwaveTransactionId = transaction_id;
      paymentRecord.completedAt = new Date();
      paymentRecord.paymentMethod = response.data.payment_type;
      paymentRecord.metadata = {
        ...paymentRecord.metadata,
        flutterwaveResponse: response.data
      };
      await paymentRecord.save();

      // Update user premium status
      const user = paymentRecord.user;
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(expiryDate.getMonth() + paymentRecord.premiumDuration);

      user.isPremium = true;
      user.premiumExpiryDate = expiryDate;
      await user.save();

      return success({
        res,
        message: 'Payment verified successfully. Premium access activated!',
        data: {
          transactionId: tx_ref,
          amount: paymentRecord.amount,
          status: 'completed',
          premiumExpiryDate: expiryDate,
          premiumDuration: paymentRecord.premiumDuration
        }
      });

    } else {
      // Payment failed
      paymentRecord.status = 'failed';
      paymentRecord.metadata = {
        ...paymentRecord.metadata,
        flutterwaveResponse: response.data,
        failureReason: 'Payment verification failed'
      };
      await paymentRecord.save();

      return error({ res, message: 'Payment verification failed', statusCode: 400 });
    }

  } catch (err) {
    console.error('Payment verification error:', err);
    return error({ res, message: err?.message || 'Failed to verify payment' });
  }
};

// Flutterwave webhook handler
const handleWebhook = async (req, res) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers['verif-hash'];

    if (!signature || signature !== secretHash) {
      return res.status(401).json({ message: 'Unauthorized webhook' });
    }

    const payload = req.body;

    if (payload.event === 'charge.completed') {
      const { tx_ref, id: transactionId, amount, currency, status } = payload.data;

      // Find payment record
      const paymentRecord = await Payment.findOne({ transactionId: tx_ref }).populate('user');
      
      if (paymentRecord && !paymentRecord.webhookVerified) {
        if (status === 'successful' && amount >= PREMIUM_PRICE && currency === 'NGN') {
          // Update payment record
          paymentRecord.status = 'completed';
          paymentRecord.flutterwaveTransactionId = transactionId;
          paymentRecord.completedAt = new Date();
          paymentRecord.webhookVerified = true;
          paymentRecord.metadata = {
            ...paymentRecord.metadata,
            webhookData: payload.data
          };
          await paymentRecord.save();

          // Update user premium status
          const user = paymentRecord.user;
          const currentDate = new Date();
          const expiryDate = new Date(currentDate);
          expiryDate.setMonth(expiryDate.getMonth() + paymentRecord.premiumDuration);

          user.isPremium = true;
          user.premiumExpiryDate = expiryDate;
          await user.save();

          console.log(`Premium upgrade completed for user ${user.email} - Transaction: ${tx_ref}`);
        } else {
          // Payment failed
          paymentRecord.status = 'failed';
          paymentRecord.webhookVerified = true;
          paymentRecord.metadata = {
            ...paymentRecord.metadata,
            webhookData: payload.data,
            failureReason: 'Payment amount or currency mismatch'
          };
          await paymentRecord.save();
        }
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// Get payment history for user
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-metadata.flutterwaveResponse -metadata.webhookData'); // Exclude sensitive data

    const total = await Payment.countDocuments({ user: userId });
    const totalPages = Math.ceil(total / limit);

    return success({
      res,
      message: 'Payment history retrieved successfully',
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages,
          totalPayments: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || 'Failed to retrieve payment history' });
  }
};

// Get premium status
const getPremiumStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('isPremium premiumExpiryDate');

    if (!user) {
      return error({ res, message: 'User not found', statusCode: 404 });
    }

    const now = new Date();
    const isExpired = user.premiumExpiryDate && user.premiumExpiryDate < now;
    
    // If premium is expired, update user status
    if (isExpired && user.isPremium) {
      user.isPremium = false;
      await user.save();
    }

    return success({
      res,
      message: 'Premium status retrieved successfully',
      data: {
        isPremium: user.isPremium && !isExpired,
        premiumExpiryDate: user.premiumExpiryDate,
        isExpired: isExpired,
        daysUntilExpiry: user.premiumExpiryDate ? Math.ceil((user.premiumExpiryDate - now) / (1000 * 60 * 60 * 24)) : null
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || 'Failed to retrieve premium status' });
  }
};

// Cancel pending payment
const cancelPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({ 
      transactionId, 
      user: userId, 
      status: 'pending' 
    });

    if (!payment) {
      return error({ res, message: 'Payment not found or cannot be cancelled', statusCode: 404 });
    }

    payment.status = 'cancelled';
    payment.metadata = {
      ...payment.metadata,
      cancelledAt: new Date(),
      cancelledBy: 'user'
    };
    await payment.save();

    return success({
      res,
      message: 'Payment cancelled successfully',
      data: { transactionId }
    });
  } catch (err) {
    return error({ res, message: err?.message || 'Failed to cancel payment' });
  }
};

module.exports = {
  initiatePremiumPayment,
  verifyPayment,
  handleWebhook,
  getPaymentHistory,
  getPremiumStatus,
  cancelPayment
};

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    flutterwaveTransactionId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    paymentType: {
      type: String,
      enum: ["premium_upgrade"],
      required: true,
    },
    premiumDuration: {
      type: Number, // Duration in months
      default: 12, // Default to 12 months
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paymentGateway: {
      type: String,
      default: "flutterwave",
    },
    webhookVerified: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster queries
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ flutterwaveTransactionId: 1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `₦${this.amount.toLocaleString()}`;
});

module.exports = mongoose.model("Payment", paymentSchema);

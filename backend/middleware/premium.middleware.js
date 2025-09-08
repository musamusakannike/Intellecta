const User = require("../models/user.model");
const { error } = require("../util/response.util");

// Middleware to check if user has premium access
const requirePremium = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('isPremium premiumExpiryDate');

    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    const now = new Date();
    const isExpired = user.premiumExpiryDate && user.premiumExpiryDate < now;

    // If premium is expired, update user status
    if (isExpired && user.isPremium) {
      user.isPremium = false;
      await user.save();
    }

    const hasAccess = user.isPremium && !isExpired;

    if (!hasAccess) {
      return error({ 
        res, 
        message: "Premium access required. Please upgrade to continue.", 
        statusCode: 403,
        data: {
          isPremium: false,
          upgradeRequired: true,
          premiumExpiryDate: user.premiumExpiryDate
        }
      });
    }

    // Add premium info to request object for use in controllers
    req.premiumInfo = {
      isPremium: true,
      premiumExpiryDate: user.premiumExpiryDate,
      daysUntilExpiry: Math.ceil((user.premiumExpiryDate - now) / (1000 * 60 * 60 * 24))
    };

    next();
  } catch (err) {
    return error({ res, message: err?.message || "Failed to verify premium access" });
  }
};

// Middleware to check premium access but not block if not premium (optional premium)
const checkPremiumOptional = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('isPremium premiumExpiryDate');

    if (user) {
      const now = new Date();
      const isExpired = user.premiumExpiryDate && user.premiumExpiryDate < now;

      // If premium is expired, update user status
      if (isExpired && user.isPremium) {
        user.isPremium = false;
        await user.save();
      }

      const hasAccess = user.isPremium && !isExpired;

      // Add premium info to request object
      req.premiumInfo = {
        isPremium: hasAccess,
        premiumExpiryDate: user.premiumExpiryDate,
        daysUntilExpiry: hasAccess ? Math.ceil((user.premiumExpiryDate - now) / (1000 * 60 * 60 * 24)) : null
      };
    } else {
      req.premiumInfo = {
        isPremium: false,
        premiumExpiryDate: null,
        daysUntilExpiry: null
      };
    }

    next();
  } catch (err) {
    // Don't block the request, just set default values
    req.premiumInfo = {
      isPremium: false,
      premiumExpiryDate: null,
      daysUntilExpiry: null
    };
    next();
  }
};

module.exports = {
  requirePremium,
  checkPremiumOptional
};

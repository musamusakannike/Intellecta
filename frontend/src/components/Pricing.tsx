"use client";
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Rocket, 
  Code, 
  Users, 
  BookOpen, 
  Award,
  Infinity,
  MessageCircle,
  Video
} from 'lucide-react';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const plans = [
    {
      id: 'free',
      name: 'Explorer',
      description: 'Perfect for beginners starting their coding journey',
      icon: Star,
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-900/20 to-cyan-900/20',
      priceMonthly: 0,
      priceYearly: 0,
      badge: null,
      features: [
        { name: '5 Free Courses', included: true },
        { name: 'Basic Code Challenges', included: true },
        { name: 'Community Forum Access', included: true },
        { name: 'Progress Tracking', included: true },
        { name: 'Mobile Learning App', included: true },
        { name: 'Certificate of Completion', included: false },
        { name: '1-on-1 Mentorship', included: false },
        { name: 'Live Workshops', included: false },
        { name: 'Project Reviews', included: false },
        { name: 'Job Placement Support', included: false }
      ],
      buttonText: 'Start Free',
      popular: false
    },
    {
      id: 'pro',
      name: 'Navigator',
      description: 'Accelerate your learning with premium features',
      icon: Zap,
      color: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-900/20 to-violet-900/20',
      priceMonthly: 29,
      priceYearly: 290,
      badge: 'Most Popular',
      features: [
        { name: 'All Explorer Features', included: true },
        { name: 'Unlimited Course Access', included: true },
        { name: 'Advanced Projects', included: true },
        { name: 'Certificate of Completion', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Live Workshops (2/month)', included: true },
        { name: 'Code Reviews', included: true },
        { name: '1-on-1 Mentorship', included: false },
        { name: 'Job Placement Support', included: false },
        { name: 'Private Slack Community', included: false }
      ],
      buttonText: 'Start Pro',
      popular: true
    },
    {
      id: 'premium',
      name: 'Commander',
      description: 'Full access with career support and mentorship',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-900/20 to-red-900/20',
      priceMonthly: 99,
      priceYearly: 990,
      badge: 'Best Value',
      features: [
        { name: 'All Navigator Features', included: true },
        { name: '1-on-1 Weekly Mentorship', included: true },
        { name: 'Job Placement Support', included: true },
        { name: 'Resume & Portfolio Reviews', included: true },
        { name: 'Interview Preparation', included: true },
        { name: 'Private Slack Community', included: true },
        { name: 'Unlimited Project Reviews', included: true },
        { name: 'Industry Networking Events', included: true },
        { name: 'Lifetime Access', included: true },
        { name: 'Custom Learning Path', included: true }
      ],
      buttonText: 'Start Commander',
      popular: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.priceMonthly === 0) return 'Free';
    const price = isYearly ? plan.priceYearly : plan.priceMonthly;
    const period = isYearly ? '/year' : '/month';
    return `$${price}${period}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.priceMonthly === 0) return null;
    const yearlyTotal = plan.priceMonthly * 12;
    const savings = yearlyTotal - plan.priceYearly;
    const savingsPercent = Math.round((savings / yearlyTotal) * 100);
    return isYearly ? `Save ${savingsPercent}%` : null;
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 overflow-hidden"
      id="pricing"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, delay: 4 }}
        />
        
        {/* Floating Icons */}
        {[Code, BookOpen, Award, Users].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute opacity-5"
            style={{ 
              left: `${10 + index * 20}%`, 
              top: `${15 + index * 15}%` 
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [-10, 10, -10],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 2,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-12 h-12 text-purple-300" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl mb-6 shadow-2xl shadow-purple-500/25"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-200 via-violet-300 to-purple-200 bg-clip-text text-transparent mb-4">
              Choose Your Mission
            </h2>
          </motion.div>
          
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto mb-8">
            Select the perfect plan for your coding journey to the stars. Every plan includes our core features to help you succeed.
          </p>

          {/* Billing Toggle */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-white' : 'text-purple-300'}`}>
              Monthly
            </span>
            <motion.button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                isYearly ? 'bg-purple-600' : 'bg-purple-800'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{
                  x: isYearly ? 32 : 0
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-white' : 'text-purple-300'}`}>
              Yearly
            </span>
            {isYearly && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full"
              >
                Save up to 20%
              </motion.span>
            )}
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative ${
                plan.popular 
                  ? 'lg:scale-105 lg:-translate-y-4' 
                  : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className={`px-6 py-2 bg-gradient-to-r ${plan.color} rounded-full text-white text-sm font-semibold shadow-xl`}>
                    {plan.badge}
                  </div>
                </motion.div>
              )}

              {/* Card */}
              <div className={`
                relative h-full p-8 bg-gradient-to-br ${plan.bgGradient} backdrop-blur-xl 
                rounded-3xl border-2 transition-all duration-500 shadow-2xl overflow-hidden
                ${plan.popular 
                  ? 'border-purple-400/50 shadow-purple-500/20' 
                  : 'border-purple-300/20 hover:border-purple-400/40'
                }
              `}>
                {/* Card Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-5`} />
                
                {/* Animated Border */}
                {plan.popular && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-50"
                    style={{
                      background: `linear-gradient(45deg, transparent, ${plan.color.includes('purple') ? '#a855f7' : '#ef4444'}/30, transparent)`,
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}

                {/* Plan Header */}
                <div className="relative z-10 text-center mb-8">
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={`
                      inline-flex items-center justify-center w-16 h-16 rounded-2xl
                      bg-gradient-to-r ${plan.color} shadow-lg mb-4
                    `}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-purple-200/80 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <motion.div
                      key={isYearly ? 'yearly' : 'monthly'}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold text-white mb-2"
                    >
                      {getPrice(plan)}
                    </motion.div>
                    {getSavings(plan) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-400 text-sm font-medium"
                      >
                        {getSavings(plan)}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="relative z-10 space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.1 * featureIndex }}
                      className="flex items-center space-x-3"
                    >
                      <div className={`
                        flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                        ${feature.included 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                        }
                      `}>
                        {feature.included ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        feature.included 
                          ? 'text-purple-100' 
                          : 'text-purple-300/50 line-through'
                      }`}>
                        {feature.name}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: plan.popular 
                      ? "0 20px 40px rgba(139, 92, 246, 0.4)" 
                      : "0 20px 40px rgba(139, 92, 246, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative w-full px-6 py-4 rounded-xl font-semibold text-white shadow-xl overflow-hidden group
                    ${plan.popular 
                      ? `bg-gradient-to-r ${plan.color} shadow-purple-500/30` 
                      : 'bg-purple-600/20 border border-purple-400/30 hover:bg-purple-600/30'
                    }
                  `}
                >
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  )}
                  <div className="relative flex items-center justify-center space-x-2">
                    <Rocket className="w-5 h-5" />
                    <span>{plan.buttonText}</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-purple-200/80 text-lg mb-8">
            Not sure which plan is right for you? 
            <br />
            Start with Explorer and upgrade anytime as you grow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-purple-200 hover:text-white border border-purple-300/20 hover:border-purple-300/40 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Sales</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-purple-200 hover:text-white border border-purple-300/20 hover:border-purple-300/40 transition-all duration-300"
            >
              <Video className="w-4 h-4" />
              <span>Book a Demo</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

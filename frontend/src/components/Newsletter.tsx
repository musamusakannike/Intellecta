"use client";
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Send, CheckCircle, Gift, Zap, Star, Sparkles } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const benefits = [
    {
      icon: Gift,
      text: "Exclusive coding challenges & projects",
      color: "text-yellow-400"
    },
    {
      icon: Zap,
      text: "Weekly tips from industry experts",
      color: "text-blue-400"
    },
    {
      icon: Star,
      text: "Early access to new courses & features",
      color: "text-purple-400"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 2000);
  };

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingElements = [
    { icon: Mail, delay: 0, x: 10, y: 20 },
    { icon: Send, delay: 1, x: 85, y: 15 },
    { icon: Sparkles, delay: 2, x: 15, y: 75 },
    { icon: Star, delay: 1.5, x: 90, y: 80 }
  ];

  if (isSubscribed) {
    return (
      <section 
        ref={sectionRef}
        className="relative py-20 bg-gradient-to-br from-green-900/40 via-purple-900/60 to-violet-900/40 overflow-hidden"
        id="newsletter"
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-2xl shadow-green-500/50">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Welcome to the Galaxy! 🚀
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-green-200/80 mb-8"
          >
            You're now part of our cosmic coding community! Check your email for a special welcome gift.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-green-300/20"
              >
                <benefit.icon className={`w-4 h-4 ${benefit.color}`} />
                <span className="text-sm text-white">{benefit.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-br from-purple-900/60 via-violet-900/60 to-indigo-900/60 overflow-hidden"
      id="newsletter"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 3 }}
        />

        {/* Floating Elements */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute z-10 opacity-20"
            style={{ left: `${element.x}%`, top: `${element.y}%` }}
            animate={{
              y: [-15, 15, -15],
              rotate: [-10, 10, -10],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: element.delay,
              ease: "easeInOut"
            }}
          >
            <div className="p-3 bg-purple-600/20 backdrop-blur-sm rounded-xl border border-purple-400/30">
              <element.icon className="w-6 h-6 text-purple-300" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-20 max-w-4xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl mb-6 shadow-2xl shadow-purple-500/25"
              whileHover={{ 
                rotate: [0, -10, 10, 0],
                scale: 1.1 
              }}
              transition={{ duration: 0.5 }}
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-violet-300 to-purple-200 bg-clip-text text-transparent mb-4">
              Join the Cosmic Newsletter
            </h2>
            
            <p className="text-xl text-purple-200/80 max-w-2xl mx-auto">
              Get exclusive coding tips, project ideas, and early access to new features delivered straight to your inbox. Join 25,000+ developers already aboard!
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-purple-300/20 hover:border-purple-400/40 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl">
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                </div>
                <p className="text-purple-100 font-medium">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter Form */}
          <motion.div
            variants={itemVariants}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your stellar email address..."
                  className="w-full px-6 py-4 pr-32 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-xl text-white placeholder-purple-300/70 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300"
                  required
                />
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Launch</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Privacy Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1 }}
              className="text-xs text-purple-300/60 mt-4"
            >
              🔒 We respect your privacy. Unsubscribe at any time. No spam, ever.
            </motion.p>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-purple-300/20"
          >
            <div className="flex items-center justify-center space-x-8 text-purple-200/60 text-sm">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full border-2 border-purple-900 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{i === 5 ? '🚀' : '👨‍💻'}</span>
                    </div>
                  ))}
                </div>
                <span>25,000+ developers</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2">4.9/5 rating</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-purple-900/20 backdrop-blur-sm z-30 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
              }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full mb-4 mx-auto flex items-center justify-center"
            >
              <Send className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-white font-semibold">Launching your subscription to the stars...</p>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Newsletter;

"use client";
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lightbulb, Globe, Smartphone, Shield, Code, Users, Rocket, Star } from 'lucide-react';

const Features = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const features = [
    {
      id: 1,
      icon: Lightbulb,
      title: "Learn by Doing",
      subtitle: "Interactive Coding",
      description: "Experience hands-on learning with real-time code execution. Build projects, not just theory.",
      color: "from-yellow-400 to-orange-500",
      bgGlow: "bg-yellow-400/10",
      borderGlow: "border-yellow-400/20",
      hoverGlow: "shadow-yellow-400/20"
    },
    {
      id: 2,
      icon: Globe,
      title: "Community Support",
      subtitle: "Global Network",
      description: "Connect with thousands of developers worldwide. Get help, share knowledge, grow together.",
      color: "from-blue-400 to-cyan-500",
      bgGlow: "bg-blue-400/10",
      borderGlow: "border-blue-400/20",
      hoverGlow: "shadow-blue-400/20"
    },
    {
      id: 3,
      icon: Smartphone,
      title: "Mobile-First Learning",
      subtitle: "Code Anywhere",
      description: "Optimized for mobile devices. Learn coding during commutes, breaks, or wherever inspiration strikes.",
      color: "from-green-400 to-emerald-500",
      bgGlow: "bg-green-400/10",
      borderGlow: "border-green-400/20",
      hoverGlow: "shadow-green-400/20"
    },
    {
      id: 4,
      icon: Shield,
      title: "Offline Mode",
      subtitle: "Always Available",
      description: "Download lessons and continue learning without internet. Your progress syncs when you're back online.",
      color: "from-purple-400 to-violet-500",
      bgGlow: "bg-purple-400/10",
      borderGlow: "border-purple-400/20",
      hoverGlow: "shadow-purple-400/20"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const floatingIcons = [
    { Icon: Code, delay: 0, x: 5, y: 15 },
    { Icon: Star, delay: 1, x: 90, y: 10 },
    { Icon: Rocket, delay: 2, x: 10, y: 85 },
    { Icon: Users, delay: 1.5, x: 85, y: 80 }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />

        {/* Floating Background Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute opacity-5"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            animate={{
              y: [-20, 20, -20],
              rotate: [-10, 10, -10],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            <item.Icon className="w-16 h-16 text-purple-300" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-200 via-violet-300 to-purple-200 bg-clip-text text-transparent mb-4">
              Why Choose Kodr?
            </h2>
          </motion.div>
          
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed">
            Experience the future of coding education with features designed to accelerate your learning journey through the digital cosmos.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              onHoverStart={() => setHoveredCard(feature.id)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative"
            >
              {/* Card Background with Glassmorphism */}
              <div className={`
                relative p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500
                ${hoveredCard === feature.id 
                  ? `${feature.bgGlow} ${feature.borderGlow} shadow-2xl ${feature.hoverGlow}` 
                  : 'bg-white/5 border-purple-300/10 shadow-xl'
                }
              `}>
                {/* Animated Border Glow */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: `linear-gradient(45deg, transparent, ${feature.color.includes('yellow') ? '#fbbf24' : feature.color.includes('blue') ? '#60a5fa' : feature.color.includes('green') ? '#34d399' : '#a855f7'}/20, transparent)`,
                    backgroundSize: '200% 200%',
                  }}
                  animate={{
                    backgroundPosition: hoveredCard === feature.id ? ['0% 0%', '100% 100%', '0% 0%'] : '0% 0%'
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Icon Container */}
                <motion.div
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1 
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative mb-6"
                >
                  <div className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-2xl
                    bg-gradient-to-r ${feature.color} shadow-lg
                    ${hoveredCard === feature.id ? 'shadow-2xl' : ''}
                    transition-all duration-300
                  `}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Icon Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 blur-xl`}
                    animate={{
                      opacity: hoveredCard === feature.id ? [0, 0.5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-purple-200 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm font-medium mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.subtitle}
                  </p>
                  
                  <p className="text-purple-200/80 leading-relaxed group-hover:text-purple-100 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Floating Particles on Hover */}
                {hoveredCard === feature.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1 h-1 rounded-full`}
                        style={{
                          background: feature.color.includes('yellow') ? '#fbbf24' : feature.color.includes('blue') ? '#60a5fa' : feature.color.includes('green') ? '#34d399' : '#a855f7',
                          left: `${20 + (i * 15)}%`,
                          top: `${20 + (i * 10)}%`,
                        }}
                        animate={{
                          y: [-10, -30, -10],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold text-white text-lg shadow-xl shadow-purple-500/25 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Start Your Cosmic Journey</span>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-violet-900/80 to-transparent"></div>
    </section>
  );
};

export default Features;
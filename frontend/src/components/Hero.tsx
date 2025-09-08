"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Rocket, Star, Zap, Play, ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const codeSnippets = [
    'const magic = () => dream()',
    'function create() { return ✨ }',
    'let future = await learn()',
    'console.log("Hello Universe")',
    'import { wonder } from "space"'
  ];

  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e:MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  // Generate consistent floating particles using seeded positions
  const generateParticles = () => {
    const seededPositions = [
      { x: 15, y: 25, size: 3, delay: 0.2 },
      { x: 85, y: 15, size: 4, delay: 0.8 },
      { x: 25, y: 75, size: 2.5, delay: 1.2 },
      { x: 75, y: 85, size: 3.5, delay: 0.5 },
      { x: 45, y: 35, size: 2, delay: 1.5 },
      { x: 65, y: 55, size: 4.5, delay: 0.3 },
      { x: 35, y: 65, size: 3, delay: 1.0 },
      { x: 55, y: 25, size: 2.5, delay: 0.7 },
      { x: 95, y: 45, size: 3.5, delay: 1.3 },
      { x: 5, y: 85, size: 2, delay: 0.9 },
      { x: 80, y: 30, size: 4, delay: 0.4 },
      { x: 20, y: 90, size: 3, delay: 1.1 },
      { x: 90, y: 70, size: 2.5, delay: 0.6 },
      { x: 40, y: 10, size: 3.5, delay: 1.4 },
      { x: 60, y: 80, size: 2, delay: 0.1 },
      { x: 30, y: 40, size: 4, delay: 0.8 },
      { x: 70, y: 20, size: 3, delay: 1.6 },
      { x: 10, y: 60, size: 2.5, delay: 0.3 },
      { x: 85, y: 95, size: 3.5, delay: 1.0 },
      { x: 50, y: 5, size: 2, delay: 0.7 }
    ];
    
    return seededPositions.map((pos, i) => ({
      id: i,
      ...pos
    }));
  };

  const particles = generateParticles();

  const floatingElements = [
    { icon: Code, delay: 0, x: 10, y: 20 },
    { icon: Zap, delay: 0.5, x: 85, y: 15 },
    { icon: Star, delay: 1, x: 15, y: 70 },
    { icon: Sparkles, delay: 1.5, x: 80, y: 75 }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-300 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating Code Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute z-10"
          style={{ left: `${element.x}%`, top: `${element.y}%` }}
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        >
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-purple-300/20">
            <element.icon className="w-6 h-6 text-purple-200" />
          </div>
        </motion.div>
      ))}

      {/* Mouse Follow Effect - Only render on client */}
      {isClient && (
        <motion.div
          className="fixed w-4 h-4 bg-purple-400/30 rounded-full blur-sm pointer-events-none z-20"
          animate={{
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      {/* Main Content */}
      <div className="relative z-30 flex items-center justify-center min-h-screen px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Area */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl mb-6 shadow-2xl shadow-purple-500/25">
              <Code className="w-10 h-10 text-white" />
            </div>
            
            <motion.h1 
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-purple-300 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Kodr
            </motion.h1>
          </motion.div>

          {/* Animated Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-4xl font-semibold text-purple-100 mb-4">
              Code Your Way to the
              <motion.span
                className="inline-block ml-3 text-transparent bg-gradient-to-r from-yellow-300 to-purple-400 bg-clip-text"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Stars ✨
              </motion.span>
            </h2>
            
            <p className="text-lg md:text-xl text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
              Embark on an interstellar journey through programming. Master coding skills 
              while exploring the infinite possibilities of the digital universe.
            </p>
          </motion.div>

          {/* Rotating Code Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mb-12"
          >
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-purple-300/20 max-w-md mx-auto">
              <div className="flex items-center mb-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCodeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="font-mono text-purple-200 text-sm md:text-base"
                >
                  {codeSnippets[currentCodeIndex]}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-purple-400"
                  >
                    |
                  </motion.span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold text-white text-lg shadow-xl shadow-purple-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Start Learning</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-purple-100 text-lg border border-purple-300/20 hover:border-purple-300/40 transition-all duration-300"
            >
              <div className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Explore Universe</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            {[
              { number: "50K+", label: "Cosmic Coders" },
              { number: "1000+", label: "Stellar Lessons" },
              { number: "∞", label: "Possibilities" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-purple-200">{stat.number}</div>
                <div className="text-sm text-purple-300/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
    </div>
  );
};

export default Hero;
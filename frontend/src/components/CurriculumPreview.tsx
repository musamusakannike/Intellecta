"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Database, 
  Smartphone, 
  Globe, 
  Brain, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Trophy,
  Clock,
  Users,
  Sparkles,
  Rocket
} from 'lucide-react';

const CurriculumPreview = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const tracks = [
    {
      id: 1,
      title: "Frontend Galaxy",
      description: "Build stunning user interfaces that captivate users across the digital cosmos",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-900/20 to-cyan-900/20",
      topics: ["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      level: "Beginner to Advanced",
      duration: "12 weeks",
      students: "15.2K",
      projects: 8,
      glowColor: "blue"
    },
    {
      id: 2,
      title: "Backend Universe",
      description: "Master server-side architecture and database management in the cloud nebula",
      icon: Database,
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-900/20 to-emerald-900/20",
      topics: ["Node.js & Express", "MongoDB", "PostgreSQL", "GraphQL"],
      level: "Intermediate",
      duration: "10 weeks",
      students: "12.7K",
      projects: 6,
      glowColor: "green"
    },
    {
      id: 3,
      title: "Mobile Constellation",
      description: "Create native mobile experiences that shine across iOS and Android galaxies",
      icon: Smartphone,
      color: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-900/20 to-violet-900/20",
      topics: ["React Native", "Flutter", "iOS Swift", "Android Kotlin"],
      level: "Intermediate",
      duration: "14 weeks",
      students: "9.3K",
      projects: 5,
      glowColor: "purple"
    },
    {
      id: 4,
      title: "AI Dimension",
      description: "Explore machine learning and artificial intelligence in the digital multiverse",
      icon: Brain,
      color: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-900/20 to-rose-900/20",
      topics: ["Python & TensorFlow", "Neural Networks", "NLP", "Computer Vision"],
      level: "Advanced",
      duration: "16 weeks",
      students: "7.8K",
      projects: 10,
      glowColor: "pink"
    },
    {
      id: 5,
      title: "DevOps Cosmos",
      description: "Navigate deployment pipelines and infrastructure across cloud constellations",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-900/20 to-red-900/20",
      topics: ["Docker & Kubernetes", "AWS/Azure", "CI/CD", "Monitoring"],
      level: "Advanced",
      duration: "8 weeks",
      students: "6.1K",
      projects: 4,
      glowColor: "orange"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e:MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, tracks.length]);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsAutoPlay(false);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsAutoPlay(false);
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsAutoPlay(false);
  };

  // Generate consistent floating particles using seeded positions
  const generateParticles = () => {
    const seededPositions = [
      { x: 8.3, y: 25.4, size: 2.1, delay: 0.3 },
      { x: 85.2, y: 15.8, size: 3.2, delay: 0.8 },
      { x: 25.7, y: 75.3, size: 1.8, delay: 1.2 },
      { x: 75.1, y: 85.9, size: 2.9, delay: 0.5 },
      { x: 45.6, y: 35.2, size: 2.3, delay: 1.5 },
      { x: 65.4, y: 55.7, size: 3.1, delay: 0.2 },
      { x: 35.8, y: 65.1, size: 2.7, delay: 1.0 },
      { x: 55.3, y: 25.9, size: 1.9, delay: 0.7 },
      { x: 95.1, y: 45.6, size: 3.4, delay: 1.3 },
      { x: 5.7, y: 85.2, size: 2.2, delay: 0.9 },
      { x: 80.4, y: 30.8, size: 2.8, delay: 0.4 },
      { x: 20.9, y: 90.3, size: 2.5, delay: 1.1 },
      { x: 90.6, y: 70.7, size: 3.0, delay: 0.6 },
      { x: 40.2, y: 10.5, size: 2.4, delay: 1.4 },
      { x: 60.8, y: 80.1, size: 1.7, delay: 0.1 }
    ];
    
    return seededPositions.map((pos, i) => ({
      id: i,
      ...pos
    }));
  };

  const particles = generateParticles();

  const currentTrackData = tracks[currentTrack];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 py-20 overflow-hidden hidden lg:block">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/3 left-1/6 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-300/50 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [-30, -120, -30],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Mouse Follow Effect */}
      <motion.div
        className="fixed w-6 h-6 bg-purple-400/20 rounded-full blur-sm pointer-events-none z-20"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <div className="relative z-30 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl mb-6 shadow-2xl shadow-purple-500/25"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-purple-300 bg-clip-text text-transparent mb-4">
            Cosmic Curriculum
          </h2>
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            Navigate through our stellar learning tracks and discover the skills that will launch your coding career into orbit
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative">
          {/* Track Navigation Dots */}
          <div className="flex justify-center mb-8 space-x-3">
            {tracks.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => selectTrack(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTrack 
                    ? 'bg-purple-400 shadow-lg shadow-purple-400/50' 
                    : 'bg-purple-600/30 hover:bg-purple-500/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Carousel Container */}
          <div className="relative h-[600px] flex items-center">
            {/* Previous Button */}
            <motion.button
              onClick={prevTrack}
              className="absolute left-0 z-40 p-4 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-300/20 hover:bg-purple-600/30 transition-all duration-300"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-purple-200" />
            </motion.button>

            {/* Track Cards */}
            <div className="flex-1 mx-16 relative h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrack}
                  initial={{ opacity: 0, x: 100, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -100, rotateY: -15 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div className={`relative h-full bg-gradient-to-br ${currentTrackData.bgGradient} rounded-3xl border border-purple-300/20 backdrop-blur-sm overflow-hidden shadow-2xl`}>
                    {/* Card Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${currentTrackData.color} opacity-5`} />
                    
                    {/* Floating Icon */}
                    <motion.div
                      className="absolute top-8 right-8"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <div className={`p-4 bg-gradient-to-r ${currentTrackData.color} rounded-2xl shadow-xl`}>
                        <currentTrackData.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="p-12 h-full flex flex-col">
                      {/* Track Header */}
                      <div className="mb-8">
                        <motion.h3 
                          className="text-4xl font-bold text-white mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {currentTrackData.title}
                        </motion.h3>
                        <motion.p 
                          className="text-lg text-purple-200/90 leading-relaxed max-w-2xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {currentTrackData.description}
                        </motion.p>
                      </div>

                      {/* Track Stats */}
                      <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Star className="w-5 h-5 text-yellow-400 mr-1" />
                            <span className="text-2xl font-bold text-white">{currentTrackData.level}</span>
                          </div>
                          <span className="text-purple-300/70 text-sm">Difficulty</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="w-5 h-5 text-purple-400 mr-1" />
                            <span className="text-2xl font-bold text-white">{currentTrackData.duration}</span>
                          </div>
                          <span className="text-purple-300/70 text-sm">Duration</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Users className="w-5 h-5 text-blue-400 mr-1" />
                            <span className="text-2xl font-bold text-white">{currentTrackData.students}</span>
                          </div>
                          <span className="text-purple-300/70 text-sm">Students</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Trophy className="w-5 h-5 text-orange-400 mr-1" />
                            <span className="text-2xl font-bold text-white">{currentTrackData.projects}</span>
                          </div>
                          <span className="text-purple-300/70 text-sm">Projects</span>
                        </div>
                      </motion.div>

                      {/* Topics Grid */}
                      <motion.div 
                        className="flex-1 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                          What You&apos;ll Master
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {currentTrackData.topics.map((topic, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 hover:border-purple-300/40 transition-all duration-300"
                              whileHover={{ scale: 1.05, y: -2 }}
                            >
                              <span className="text-purple-100 font-medium">{topic}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* CTA Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-fit px-8 py-4 bg-gradient-to-r ${currentTrackData.color} rounded-xl font-semibold text-white text-lg shadow-xl overflow-hidden group`}
                      >
                        <div className="flex items-center space-x-2">
                          <Code className="w-5 h-5" />
                          <span>Start This Journey</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <motion.button
              onClick={nextTrack}
              className="absolute right-0 z-40 p-4 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-300/20 hover:bg-purple-600/30 transition-all duration-300"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6 text-purple-200" />
            </motion.button>
          </div>

          {/* Track Preview Strip */}
          <motion.div 
            className="flex justify-center mt-12 space-x-4 overflow-x-auto pb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {tracks.map((track, index) => (
              <motion.button
                key={track.id}
                onClick={() => selectTrack(index)}
                className={`flex-shrink-0 p-4 rounded-xl border transition-all duration-300 ${
                  index === currentTrack
                    ? 'bg-purple-600/30 border-purple-400/50 scale-105'
                    : 'bg-purple-900/20 border-purple-600/20 hover:border-purple-500/40'
                }`}
                whileHover={{ scale: index === currentTrack ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-r ${track.color} rounded-lg`}>
                    <track.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{track.title}</div>
                    <div className="text-xs text-purple-300/70">{track.duration}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
    </div>
  );
};

export default CurriculumPreview;
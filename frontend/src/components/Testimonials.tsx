"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Award, Code, TrendingUp } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Frontend Developer at Meta",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b8c1?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Kodr transformed my coding journey completely! From knowing nothing about programming to landing my dream job at Meta in just 8 months. The interactive lessons and real-world projects made all the difference.",
      achievement: "Got hired at Meta",
      courseCompleted: "Frontend Galaxy",
      salaryIncrease: "+150%"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Full Stack Engineer at Spotify",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The community support here is incredible. Whenever I got stuck, there was always someone ready to help. The mentorship program connected me with industry professionals who guided me through my career transition.",
      achievement: "Career Transition Success",
      courseCompleted: "Backend Universe",
      salaryIncrease: "+200%"
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "Mobile Developer at Uber",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "As a working mom, I needed flexibility in my learning schedule. Kodr's mobile-first approach allowed me to code during my commute and practice during lunch breaks. Now I'm building apps used by millions!",
      achievement: "Flexible Learning Success",
      courseCompleted: "Mobile Constellation",
      salaryIncrease: "+180%"
    },
    {
      id: 4,
      name: "David Park",
      role: "AI Engineer at OpenAI",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The AI Dimension track is absolutely mind-blowing. The instructors explain complex concepts like neural networks in such an intuitive way. I went from complete beginner to contributing to cutting-edge AI research.",
      achievement: "AI Research Contributor",
      courseCompleted: "AI Dimension",
      salaryIncrease: "+250%"
    },
    {
      id: 5,
      name: "Aisha Patel",
      role: "DevOps Engineer at AWS",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The hands-on projects in the DevOps Cosmos track are exactly what you'd work on in real companies. I built production-grade deployment pipelines that impressed my interviewers and landed me a role at AWS.",
      achievement: "AWS Career Launch",
      courseCompleted: "DevOps Cosmos",
      salaryIncrease: "+190%"
    },
    {
      id: 6,
      name: "James Mitchell",
      role: "Senior Developer at Netflix",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "What sets Kodr apart is the quality of education. Every lesson is crafted with care, every project has a purpose. I've recommended it to my entire team at Netflix, and several have already started their journey here.",
      achievement: "Team Leader Success",
      courseCompleted: "Full Stack Journey",
      salaryIncrease: "+170%"
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

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
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const stats = [
    { number: "10K+", label: "Success Stories", icon: Award },
    { number: "95%", label: "Job Placement Rate", icon: TrendingUp },
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "180%", label: "Average Salary Increase", icon: Code }
  ];

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length]
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 3 }}
        />
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
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-200 via-violet-300 to-purple-200 bg-clip-text text-transparent mb-4">
              Success Stories
            </h2>
          </motion.div>
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            Real students, real transformations. Discover how Kodr has launched thousands of careers into the digital cosmos.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-300/10 hover:border-purple-400/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-purple-300/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Desktop: Side-by-side testimonials */}
          <div className="hidden lg:block">
            <div className="relative h-[600px] flex items-center">
              {/* Previous Button */}
              <motion.button
                onClick={prevTestimonial}
                className="absolute left-0 z-30 p-4 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-300/20 hover:bg-purple-600/30 transition-all duration-300"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 text-purple-200" />
              </motion.button>

              {/* Testimonial Cards */}
              <div className="flex-1 mx-16 grid grid-cols-3 gap-8">
                {visibleTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    variants={cardVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`relative p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-purple-300/20 shadow-2xl ${
                      index === 0 ? 'ring-2 ring-purple-400/50 scale-105' : ''
                    }`}
                  >
                    {/* Quote Icon */}
                    <motion.div
                      className="absolute -top-4 -left-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: index }}
                    >
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-xl">
                        <Quote className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-purple-100 leading-relaxed mb-6 text-sm">
                      "{testimonial.text}"
                    </p>

                    {/* Achievement Badge */}
                    <div className="mb-6 p-3 bg-purple-600/20 rounded-lg border border-purple-400/30">
                      <div className="text-xs text-purple-300">Achievement Unlocked</div>
                      <div className="text-sm font-semibold text-purple-100">{testimonial.achievement}</div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-purple-400/50"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                        <div className="text-purple-300/70 text-xs">{testimonial.role}</div>
                        <div className="text-green-400 text-xs font-medium">{testimonial.salaryIncrease} salary increase</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Next Button */}
              <motion.button
                onClick={nextTestimonial}
                className="absolute right-0 z-30 p-4 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-300/20 hover:bg-purple-600/30 transition-all duration-300"
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6 text-purple-200" />
              </motion.button>
            </div>
          </div>

          {/* Mobile: Single testimonial */}
          <div className="lg:hidden">
            <div className="relative">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-purple-300/20 shadow-2xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-purple-100 leading-relaxed mb-6">
                  "{testimonials[currentIndex].text}"
                </p>
                
                <div className="mb-6 p-3 bg-purple-600/20 rounded-lg border border-purple-400/30">
                  <div className="text-xs text-purple-300">Achievement Unlocked</div>
                  <div className="text-sm font-semibold text-purple-100">{testimonials[currentIndex].achievement}</div>
                </div>
                
                <div className="flex items-center">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-purple-400/50"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{testimonials[currentIndex].name}</div>
                    <div className="text-purple-300/70 text-sm">{testimonials[currentIndex].role}</div>
                    <div className="text-green-400 text-sm font-medium">{testimonials[currentIndex].salaryIncrease} salary increase</div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Navigation */}
              <div className="flex justify-between items-center mt-6">
                <motion.button
                  onClick={prevTestimonial}
                  className="p-3 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-300/20"
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-5 h-5 text-purple-200" />
                </motion.button>
                
                <motion.button
                  onClick={nextTestimonial}
                  className="p-3 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-300/20"
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5 text-purple-200" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-12 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-purple-400 shadow-lg shadow-purple-400/50' 
                    : 'bg-purple-600/30 hover:bg-purple-500/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

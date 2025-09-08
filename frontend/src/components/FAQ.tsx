"use client";
import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Book, Award, Clock } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const faqs = [
    {
      id: 1,
      category: "Getting Started",
      icon: Book,
      question: "How do I get started with Kodr?",
      answer: "Getting started is easy! Simply create a free account and you'll have access to 5 free courses immediately. You can explore our learning platform, complete coding challenges, and join our community discussions. Once you're ready to dive deeper, you can upgrade to a paid plan for unlimited access to all courses and premium features."
    },
    {
      id: 2,
      category: "Courses",
      icon: Book,
      question: "What programming languages and technologies do you teach?",
      answer: "We offer comprehensive tracks in Frontend Development (React, Next.js, TypeScript, Tailwind CSS), Backend Development (Node.js, Express, MongoDB, PostgreSQL), Mobile Development (React Native, Flutter, Swift, Kotlin), AI & Machine Learning (Python, TensorFlow, Neural Networks), and DevOps (Docker, Kubernetes, AWS, CI/CD). Each track is designed to take you from beginner to job-ready professional."
    },
    {
      id: 3,
      category: "Learning",
      icon: Clock,
      question: "How long does it take to complete a learning track?",
      answer: "Our learning tracks vary in duration: Frontend Galaxy (12 weeks), Backend Universe (10 weeks), Mobile Constellation (14 weeks), AI Dimension (16 weeks), and DevOps Cosmos (8 weeks). However, you can learn at your own pace. Many students dedicate 10-15 hours per week and complete tracks faster, while others take more time depending on their schedule and prior experience."
    },
    {
      id: 4,
      category: "Certificates",
      icon: Award,
      question: "Do I get certificates upon completion?",
      answer: "Yes! Navigator and Commander plan subscribers receive industry-recognized certificates for each completed learning track. These certificates are backed by our partnerships with leading tech companies and can be shared on LinkedIn, GitHub, and your resume. Free Explorer users get completion badges for completed courses."
    },
    {
      id: 5,
      category: "Pricing",
      icon: HelpCircle,
      question: "Can I switch between plans anytime?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. When you upgrade, you'll get immediate access to premium features. If you downgrade, you'll retain access to premium features until the end of your current billing cycle. We also offer a 14-day money-back guarantee on all paid plans."
    },
    {
      id: 6,
      category: "Support",
      icon: MessageCircle,
      question: "What kind of support do you provide?",
      answer: "Support varies by plan: Explorer users get community forum access, Navigator users get priority email support plus live workshops, and Commander users get 1-on-1 weekly mentorship, job placement support, and access to our private Slack community with industry professionals. All users have access to our comprehensive knowledge base and video tutorials."
    },
    {
      id: 7,
      category: "Learning",
      icon: Clock,
      question: "Can I learn on mobile devices?",
      answer: "Yes! Kodr is designed mobile-first. Our responsive web app and dedicated mobile apps (iOS/Android) let you code, watch videos, complete challenges, and track progress on any device. You can even download lessons for offline learning. Your progress syncs seamlessly across all devices."
    },
    {
      id: 8,
      category: "Careers",
      icon: Award,
      question: "Do you provide job placement assistance?",
      answer: "Commander plan subscribers get comprehensive job placement support including: resume and portfolio reviews, mock interviews, salary negotiation guidance, direct introductions to hiring partners, and access to our exclusive job board. We have a 95% job placement rate within 6 months for Commander subscribers who complete their chosen track."
    },
    {
      id: 9,
      category: "Technical",
      icon: Book,
      question: "Do I need prior programming experience?",
      answer: "Not at all! Our courses are designed for complete beginners. We start with fundamental concepts and gradually build up to advanced topics. Each lesson includes hands-on exercises and real-world projects. If you already have some experience, our adaptive learning system will help you skip basics and focus on areas where you need improvement."
    },
    {
      id: 10,
      category: "Community",
      icon: MessageCircle,
      question: "How does the community and mentorship work?",
      answer: "Our community includes over 50,000 active learners and industry professionals. Navigator users get access to live workshops and group mentoring sessions. Commander users get paired with experienced developers for weekly 1-on-1 mentorship sessions, career guidance, and code reviews. Our private Slack community connects you with peers and mentors for real-time help and networking."
    }
  ];

  const toggleItem = (itemId: number) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
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

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 overflow-hidden"
      id="faq"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/5 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 3 }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
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
            <HelpCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-200 via-violet-300 to-purple-200 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>
          
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            Got questions? We've got answers! Find everything you need to know about your coding journey with Kodr.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className={`
                  relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl 
                  rounded-2xl border border-purple-300/20 overflow-hidden
                  transition-all duration-500 hover:border-purple-400/40
                  ${openItems.includes(faq.id) ? 'shadow-2xl shadow-purple-500/20 border-purple-400/50' : 'shadow-xl'}
                `}
                whileHover={{ y: -2 }}
              >
                {/* Question Header */}
                <motion.button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between group"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Category Badge */}
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <faq.icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-xs font-medium text-purple-300/70 bg-purple-600/20 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    
                    {/* Question Text */}
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  
                  {/* Toggle Icon */}
                  <motion.div
                    animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <ChevronDown className="w-5 h-5 text-purple-300" />
                  </motion.div>
                </motion.button>

                {/* Answer Content */}
                <AnimatePresence>
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <motion.div
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="border-t border-purple-300/10 pt-4"
                        >
                          <p className="text-purple-200/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated Border Glow */}
                {openItems.includes(faq.id) && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-20"
                    style={{
                      background: 'linear-gradient(45deg, transparent, #a855f7/30, transparent)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16 p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-purple-300/20"
        >
          <motion.div
            className="mb-6"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-purple-200/80 mb-8 max-w-2xl mx-auto">
            Our community and support team are here to help! Get instant answers from our active community or reach out to our support team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold text-white shadow-xl shadow-purple-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Join Community</span>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-purple-200 hover:text-white border border-purple-300/20 hover:border-purple-300/40 transition-all duration-300"
            >
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>Contact Support</span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-violet-900/80 to-transparent"></div>
    </section>
  );
};

export default FAQ;

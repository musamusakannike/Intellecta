"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Mail, 
  MapPin, 
  Phone,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Linkedin,
  Youtube,
  ArrowUp,
  Heart,
  Star,
  Rocket
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    'Learning': [
      { name: 'Frontend Galaxy', href: '#courses' },
      { name: 'Backend Universe', href: '#courses' },
      { name: 'Mobile Constellation', href: '#courses' },
      { name: 'AI Dimension', href: '#courses' },
      { name: 'DevOps Cosmos', href: '#courses' },
      { name: 'Free Courses', href: '#courses' }
    ],
    'Company': [
      { name: 'About Us', href: '#about' },
      { name: 'Our Mission', href: '#mission' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' },
      { name: 'Blog', href: '#blog' },
      { name: 'Partners', href: '#partners' }
    ],
    'Support': [
      { name: 'Help Center', href: '#help' },
      { name: 'Community', href: '#community' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'System Status', href: '#status' },
      { name: 'Bug Reports', href: '#bugs' },
      { name: 'Feature Requests', href: '#features' }
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' },
      { name: 'Accessibility', href: '#accessibility' },
      { name: 'Refund Policy', href: '#refunds' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/kodr', name: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Facebook, href: 'https://facebook.com/kodr', name: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://instagram.com/kodr', name: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Github, href: 'https://github.com/kodr', name: 'GitHub', color: 'hover:text-gray-400' },
    { icon: Linkedin, href: 'https://linkedin.com/company/kodr', name: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: Youtube, href: 'https://youtube.com/kodr', name: 'YouTube', color: 'hover:text-red-500' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 overflow-hidden">
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute top-8 right-8 z-20 p-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </motion.button>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/6 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-violet-400/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.15, 0.05, 0.15],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 3 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-12"
        >
          {/* Company Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg shadow-purple-500/25">
                <Code className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-violet-300 bg-clip-text text-transparent">
                Kodr
              </span>
            </motion.div>

            <p className="text-purple-200/80 leading-relaxed mb-6 max-w-md">
              Empowering the next generation of developers through innovative, interactive learning experiences. Join thousands who have transformed their careers with Kodr.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-purple-200/70">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@kodr.dev</span>
              </div>
              <div className="flex items-center space-x-3 text-purple-200/70">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-KODR</span>
              </div>
              <div className="flex items-center space-x-3 text-purple-200/70">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Ilorin, Kwara State</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-purple-800/30 rounded-lg text-purple-300 ${social.color} border border-purple-700/50 hover:border-purple-500/50 transition-all duration-300`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              variants={itemVariants}
              className="lg:col-span-1"
            >
              <h3 className="text-white font-semibold text-lg mb-6 relative">
                {category}
                <motion.div
                  className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '2rem' }}
                  transition={{ delay: 0.5 + categoryIndex * 0.1 }}
                />
              </h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + categoryIndex * 0.1 + index * 0.05 }}
                  >
                    <a
                      href={link.href}
                      className="text-purple-200/70 hover:text-purple-200 transition-colors duration-200 text-sm block hover:translate-x-1 transform transition-transform"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-purple-500/20"
        >
          {[
            { number: '50K+', label: 'Students', icon: Star },
            { number: '1000+', label: 'Courses', icon: Code },
            { number: '95%', label: 'Success Rate', icon: Rocket },
            { number: '24/7', label: 'Support', icon: Heart }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl mb-3 group-hover:from-purple-500/30 group-hover:to-violet-500/30 transition-all duration-300">
                <stat.icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-purple-300/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="pt-8 flex flex-col md:flex-row items-center justify-between text-sm"
        >
          <div className="flex items-center space-x-2 text-purple-200/60 mb-4 md:mb-0">
            <span>© 2024 Kodr. Made with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3
              }}
            >
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </motion.div>
            <span>in Ilorin, kwara state</span>
          </div>
          
          <div className="flex items-center space-x-6 text-purple-200/60">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>Trusted by 50,000+ developers</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => {
          // Use seeded positions to avoid hydration mismatch
          const positions = [
            { left: 15, top: 25 },
            { left: 85, top: 15 },
            { left: 25, top: 75 },
            { left: 75, top: 85 },
            { left: 45, top: 35 },
            { left: 65, top: 55 },
            { left: 35, top: 65 },
            { left: 55, top: 25 }
          ];
          const position = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
              }}
              animate={{
                y: [-20, -100, -20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;

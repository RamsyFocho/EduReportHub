"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import motion
import Link from "next/link";
import { ModeToggle } from '@/components/shared/ModeToggle';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { AuthAwareLoginButton } from '@/components/shared/AuthAwareLoginButton';

import { 
  BookOpenCheck, 
  BarChart, 
  Users, 
  CheckSquare, 
  ArrowRight, 
  Menu, 
  X, 
  Star,
  ChevronDown,
  Play,
  Shield,
  Zap,
  Globe,
} from 'lucide-react';

// Main Landing Page Component
const LandingPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
  }, []);

  // Animation Variants for reusability
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };


  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const features = [
    {
      icon: <CheckSquare className="h-8 w-8" />,
      title: "Streamlined Reporting",
      description: "Generate comprehensive reports with just a few clicks. Save time and ensure accuracy with our automated reporting system."
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Gain deep insights into your data with powerful analytics tools and interactive dashboards."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "User Management",
      description: "Efficiently manage user access, roles, and permissions across your organization."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and compliance certifications."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Optimized performance ensures your reports load instantly, even with large datasets."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Access",
      description: "Access your data from anywhere in the world with our cloud-based platform."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Connect Your Data",
      description: "Easily integrate with your existing systems and import your data in minutes."
    },
    {
      step: "02", 
      title: "Customize Reports",
      description: "Use our drag-and-drop interface to create reports tailored to your needs."
    },
    {
      step: "03",
      title: "Share & Collaborate",
      description: "Share insights with your team and collaborate in real-time on reports."
    },
    {
      step: "04",
      title: "Automate & Scale",
      description: "Set up automated workflows and scale as your business grows."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Data Director",
      company: "TechCorp Inc.",
      content: "EduReport Hub has revolutionized how we handle our reporting. What used to take hours now takes minutes.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Operations Manager", 
      company: "Global Solutions",
      content: "The analytics capabilities are incredible. We've gained insights we never knew we needed.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "CEO",
      company: "StartupXYZ",
      content: "As a growing company, the scalability and ease of use have been game-changers for us.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const faqs = [
    {
      question: "How quickly can I get started with EduReport Hub?",
      answer: "You can be up and running in under 15 minutes. Our onboarding process is designed to be quick and intuitive, with step-by-step guidance to help you connect your data sources and create your first report."
    },
    {
      question: "Is my data secure with EduReport Hub?",
      answer: "Absolutely. We use enterprise-grade security including AES-256 encryption, SOC 2 compliance, and regular security audits. Your data is stored in secure, geo-redundant data centers with 99.9% uptime guarantee."
    },
    {
      question: "Can I integrate with my existing tools?",
      answer: "Yes! EduReport Hub integrates with over 100+ popular business tools including CRM systems, databases, cloud storage, and more. Our API also allows for custom integrations."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer 24/7 support via chat, email, and phone. Premium plans include dedicated account management and priority support with guaranteed response times."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start, and you can upgrade or cancel anytime."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "1M+", label: "Reports Generated" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ${
        isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-lg">
                <BookOpenCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                EduReport Hub
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-green-600 transition-colors">Testimonials</a>
              <a href="#faq" className="text-sm font-medium hover:text-green-600 transition-colors">FAQ</a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <ModeToggle />
               <AuthAwareLoginButton />           
              
              <Link href="login" className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <ModeToggle />
              <AuthAwareLoginButton />     
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden border-t py-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">How it Works</a>
                <a href="#testimonials" className="text-sm font-medium hover:text-green-600 transition-colors">Testimonials</a>
                <a href="#faq" className="text-sm font-medium hover:text-green-600 transition-colors">FAQ</a>
                <hr className={`${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
                <AuthAwareLoginButton /> 
                <button className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-orange-600 transition-all duration-300 text-left w-fit">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 via-green-600 to-orange-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center lg:text-left text-white"
                  >
                    <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                      Transform Your Data Into 
                      <span className="block text-orange-200">Actionable Insights</span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-xl text-green-100 mb-8 max-w-lg mx-auto lg:mx-0">
                      Streamline your reporting process with our powerful analytics platform. 
                      Generate professional reports in minutes, not hours.
                    </motion.p>
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                        Start Free Trial <ArrowRight className="h-5 w-5" />
                      </button>
                      <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2">
                        <Play className="h-5 w-5" /> Watch Demo
                      </button>
                    </motion.div>
                    
                    {/* Stats */}
                    <motion.div 
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20"
                    >
                      {stats.map((stat, index) => (
                        <motion.div key={index} variants={fadeUp} className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</div>
                          <div className="text-green-100 text-sm">{stat.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className="relative"
                  >
                    <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-2">
                      <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Dashboard Preview"
                        className="w-full h-auto rounded-xl"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl -z-10"></div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section 
          id="features" 
          className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Powerful Features for 
                <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent"> Modern Teams</span>
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Everything you need to create, analyze, and share professional reports with your team.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    isDark 
                      ? 'bg-gray-900 hover:bg-gray-900/80' 
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <div className="bg-gradient-to-r from-green-500 to-orange-500 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
  {/* Mobile-First Showcase */}
        <motion.section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Designed for On-the-Go Inspections</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our mobile-first approach ensures a seamless experience for inspectors in the field.
                </p>
              </div>
            </div>
            <div className="mx-auto flex justify-center py-12">
              <div className="relative w-full max-w-md aspect-[9/16] rounded-[2.5rem] bg-gray-800 dark:bg-gray-950 shadow-2xl overflow-hidden border-[10px] border-gray-800 dark:border-gray-950">
                <div className="absolute inset-0 p-2 overflow-hidden">
                  <img
                    alt="Mobile App Screenshot"
                    className="object-cover w-full h-full rounded-[1.5rem]"
                    height="800"
                    src="/mobileImage.png"
                    style={{
                      aspectRatio: "450/800",
                      objectFit: "cover",
                    }}
                    width="450"
                  />
                </div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-700 rounded-full" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-700 rounded-full" />
              </div>
            </div>
          </div>
        </motion.section>
        {/* How It Works Section */}
        <motion.section 
          id="how-it-works" 
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Get started in minutes with our simple 4-step process.
              </p>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={staggerContainer}>
              {steps.map((step, index) => (
                <motion.div key={index} variants={fadeUp} className="relative">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full">
                      <ArrowRight className="h-6 w-6 text-green-500 mx-auto" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section 
          id="testimonials" 
          className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Join thousands of satisfied customers who have transformed their reporting process.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className={`rounded-2xl p-8 lg:p-12 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-2xl font-medium mb-6">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{testimonials[activeTestimonial].name}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Navigation */}
                <div className="flex justify-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === activeTestimonial
                          ? 'bg-gradient-to-r from-green-500 to-orange-500'
                          : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          id="faq" 
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Got questions? We've got answers. Can't find what you're looking for? Contact our support team.
              </p>
            </motion.div>

            <motion.div className="max-w-3xl mx-auto" variants={staggerContainer}>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className={`border rounded-lg mb-4 ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 transform transition-transform ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFAQ === index && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`px-6 pb-4 overflow-hidden ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {faq.answer}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="bg-gradient-to-r from-green-500 to-orange-500 py-20 text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Reporting?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
              Join thousands of teams who have already revolutionized their data analysis workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                Start Your Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300">
                Schedule a Demo
              </button>
            </div>
            <p className="text-sm mt-4 text-green-100">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.2 }}
             variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8">
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-lg">
                  <BookOpenCheck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                  EduReport Hub
                </span>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Transform your data into actionable insights with our powerful reporting platform.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-green-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">API</a></li>
              </ul>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-green-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Contact</a></li>
              </ul>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-green-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </motion.div>
          </motion.div>
          
          <hr className={`my-8 ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
          
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              © 2025 EduReport Hub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
                Twitter
              </a>
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
                LinkedIn
              </a>
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
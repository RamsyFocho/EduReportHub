"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
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

const LandingPage = () => {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(isDarkMode);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

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


  const features = [
    {
      icon: <CheckSquare className="h-8 w-8" />,
      title: t('landing_page.features.streamlined_reporting.title'),
      description: t('landing_page.features.streamlined_reporting.description')
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: t('landing_page.features.advanced_analytics.title'),
      description: t('landing_page.features.advanced_analytics.description')
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('landing_page.features.user_management.title'),
      description: t('landing_page.features.user_management.description')
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('landing_page.features.enterprise_security.title'),
      description: t('landing_page.features.enterprise_security.description')
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('landing_page.features.lightning_fast.title'),
      description: t('landing_page.features.lightning_fast.description')
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t('landing_page.features.global_access.title'),
      description: t('landing_page.features.global_access.description')
    }
  ];

  const steps = [
    {
      step: "01",
      title: t('landing_page.how_it_works.steps.connect.title'),
      description: t('landing_page.how_it_works.steps.connect.description')
    },
    {
      step: "02", 
      title: t('landing_page.how_it_works.steps.customize.title'),
      description: t('landing_page.how_it_works.steps.customize.description')
    },
    {
      step: "03",
      title: t('landing_page.how_it_works.steps.share.title'),
      description: t('landing_page.how_it_works.steps.share.description')
    },
    {
      step: "04",
      title: t('landing_page.how_it_works.steps.automate.title'),
      description: t('landing_page.how_it_works.steps.automate.description')
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Data Director",
      company: "TechCorp Inc.",
      content: t('landing_page.testimonials.quotes.quote1'),
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Operations Manager", 
      company: "Global Solutions",
      content: t('landing_page.testimonials.quotes.quote2'),
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "CEO",
      company: "StartupXYZ",
      content: t('landing_page.testimonials.quotes.quote3'),
      rating: 5,
      avatar: "ER"
    }
  ];

  const faqs = [
    {
      question: t('landing_page.faq.questions.q1.question'),
      answer: t('landing_page.faq.questions.q1.answer')
    },
    {
      question: t('landing_page.faq.questions.q2.question'),
      answer: t('landing_page.faq.questions.q2.answer')
    },
    {
      question: t('landing_page.faq.questions.q3.question'),
      answer: t('landing_page.faq.questions.q3.answer')
    },
    {
      question: t('landing_page.faq.questions.q4.question'),
      answer: t('landing_page.faq.questions.q4.answer')
    },
    {
      question: t('landing_page.faq.questions.q5.question'),
      answer: t('landing_page.faq.questions.q5.answer')
    }
  ];

  const stats = [
    { number: "50K+", label: t('landing_page.hero.stats.users') },
    { number: "1M+", label: t('landing_page.hero.stats.reports') },
    { number: "99.9%", label: t('landing_page.hero.stats.uptime') },
    { number: "24/7", label: t('landing_page.hero.stats.support') }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ${
        isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-lg">
                <BookOpenCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                {t('app_name')}
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">{t('landing_page.nav.features')}</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">{t('landing_page.nav.how_it_works')}</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-green-600 transition-colors">{t('landing_page.nav.testimonials')}</a>
              <a href="#faq" className="text-sm font-medium hover:text-green-600 transition-colors">{t('landing_page.nav.faq')}</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <ModeToggle />
               <AuthAwareLoginButton />           
              
              <Link href="/login" className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
                {t('landing_page.hero.get_started')}
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <ModeToggle />
               <button
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className={`md:hidden border-t py-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">{t('landing_page.nav.features')}</a>
                <a href="#how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">{t('landing_page.nav.how_it_works')}</a>
                <a href="#testimonials" className="text-sm font-medium hover:text-green-600 transition-colors">{t('landing_page.nav.testimonials')}</a>
                <a href="#faq" className="text-sm font-medium hover:text-green-600 transition-colors">{t('landing_page.nav.faq')}</a>
                <hr className={`${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
                <AuthAwareLoginButton /> 
                <Link href="/login" className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-orange-600 transition-all duration-300 text-left w-fit">
                  {t('landing_page.hero.get_started')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.header>

      <main>
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
                    <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" dangerouslySetInnerHTML={{ __html: t('landing_page.hero.title') }}>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-xl text-green-100 mb-8 max-w-lg mx-auto lg:mx-0">
                      {t('landing_page.hero.subtitle')}
                    </motion.p>
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link href="/login" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                        {t('landing_page.hero.start_trial')} <ArrowRight className="h-5 w-5" />
                      </Link>
                      <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2">
                        <Play className="h-5 w-5" /> {t('landing_page.hero.watch_demo')}
                      </button>
                    </motion.div>
                    
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
                        alt={t('landing_page.hero.dashboard_alt')}
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: t('landing_page.features.title') }}>
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('landing_page.features.subtitle')}
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

        <motion.section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('landing_page.mobile_showcase.title')}</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  {t('landing_page.mobile_showcase.subtitle')}
                </p>
              </div>
            </div>
            <div className="mx-auto flex justify-center py-12">
              <div className="relative w-full max-w-md aspect-[9/16] rounded-[2.5rem] bg-gray-800 dark:bg-gray-950 shadow-2xl overflow-hidden border-[10px] border-gray-800 dark:border-gray-950">
                <div className="absolute inset-0 p-2 overflow-hidden">
                  <img
                    alt={t('landing_page.mobile_showcase.image_alt')}
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
                {t('landing_page.how_it_works.title')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('landing_page.how_it_works.subtitle')}
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
                {t('landing_page.testimonials.title')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('landing_page.testimonials.subtitle')}
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
                {t('landing_page.faq.title')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('landing_page.faq.subtitle')}
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

        <motion.section 
          className="bg-gradient-to-r from-green-500 to-orange-500 py-20 text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {t('landing_page.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
              {t('landing_page.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                {t('landing_page.cta.start_trial')}
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300">
                {t('landing_page.cta.schedule_demo')}
              </button>
            </div>
            <p className="text-sm mt-4 text-green-100">
              {t('landing_page.cta.subtext')}
            </p>
          </div>
        </motion.section>
      </main>

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
                  {t('app_name')}
                </span>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                {t('landing_page.footer.description')}
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <h3 className="font-semibold mb-4">{t('landing_page.footer.product.title')}</h3>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.product.features')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.product.pricing')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.product.integrations')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.product.api')}</a></li>
              </ul>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <h3 className="font-semibold mb-4">{t('landing_page.footer.company.title')}</h3>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.company.about')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.company.blog')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.company.careers')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.company.contact')}</a></li>
              </ul>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <h3 className="font-semibold mb-4">{t('landing_page.footer.support.title')}</h3>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.support.help_center')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.support.documentation')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.support.status')}</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">{t('landing_page.footer.support.privacy_policy')}</a></li>
              </ul>
            </motion.div>
          </motion.div>
          
          <hr className={`my-8 ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
          
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              {t('landing_page.footer.copyright')}
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
    
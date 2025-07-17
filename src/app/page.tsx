"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpenCheck, BarChart, Users, CheckSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export default function LandingPage() {
  const { t } = useTranslation();

  const featureCards = [
    {
      icon: <CheckSquare className="h-8 w-8 text-primary" />,
      title: t('features.streamlined_reporting'),
      description: t('features.streamlined_reporting_desc'),
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: t('features.data_analytics'),
      description: t('features.data_analytics_desc'),
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t('features.user_management'),
      description: t('features.user_management_desc'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <BookOpenCheck className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">EduReport Hub</span>
          </Link>
          <nav className="flex items-center gap-4 ml-auto">
            <LanguageSwitcher />
            <ModeToggle />
            <Button asChild>
              <Link href="/login">{t('login')}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6"
          >
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              {t('hero.subtitle')}
            </p>
            <Button size="lg" asChild>
              <Link href="/login">
                {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://placehold.co/600x400.png"
              alt="Dashboard Preview"
              data-ai-hint="dashboard analytics"
              className="rounded-xl shadow-2xl"
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">{t('features.title')}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('features.subtitle')}
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {featureCards.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-col items-center text-center gap-4">
                      {feature.icon}
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-secondary border-t">
        <div className="container py-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} EduReport Hub. {t('footer.rights_reserved')}
        </div>
      </footer>
    </div>
  );
}


"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await api.post('/api/auth/forgot-password', { email: values.email });
      setIsSuccess(true);
      toast({
        title: t('forgot_password_page.success_title'),
        description: t('forgot_password_page.success_desc'),
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('forgot_password_page.failed_title'),
        description: error.message || t('forgot_password_page.failed_desc'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-2xl">
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
              <BookOpenCheck className="h-8 w-8" />
            </Link>
            <CardTitle className="font-headline text-3xl">{t('forgot_password_page.title')}</CardTitle>
            <CardDescription>{t('forgot_password_page.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center">
                <p>{t('forgot_password_page.success_message')}</p>
                <Link href="/login" className="text-sm text-primary underline">
                  {t('forgot_password_page.back_to_login')}
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t('sending_link') : t('send_reset_link')}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

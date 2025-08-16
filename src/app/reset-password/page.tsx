
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
    } else {
      toast({
        variant: 'destructive',
        title: t('reset_password_page.missing_token_title'),
        description: t('reset_password_page.missing_token_desc'),
      });
    }
  }, [searchParams, t, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: values.newPassword });
      setIsSuccess(true);
      toast({
        title: t('reset_password_page.success_title'),
        description: t('reset_password_page.success_desc'),
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('reset_password_page.failed_title'),
        description: error.message || t('reset_password_page.failed_desc'),
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
            <CardTitle className="font-headline text-3xl">{t('reset_password_page.title')}</CardTitle>
            <CardDescription>{t('reset_password_page.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center">
                <p>{t('reset_password_page.success_message')}</p>
                <Link href="/login" className="text-sm text-primary underline">
                  {t('reset_password_page.back_to_login')}
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('new_password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting || !token}>
                    {isSubmitting ? t('resetting_password') : t('reset_password')}
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

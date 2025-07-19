
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Invalid email address.'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters.').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine(data => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, fetchUser } = useAuth();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
      phoneNumber: '',
      address: '',
      newPassword: '',
      confirmPassword: ''
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
      });
    }
  }, [user, form]);


  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsSubmitting(true);
    
    const payload: any = {
      username: values.username,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
    };

    if (values.newPassword) {
      payload.password = values.newPassword;
    }

    try {
      await api.put('/api/users/update/profile', payload);
      toast({ title: t('success'), description: t('profile_page.update_success') });
      await fetchUser(); // Refresh user data in AuthContext
      form.reset({ ...form.getValues(), newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      let description = t('unknown_error');
       if (error.status === 400 && error.message) {
          description = error.message;
       } else if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
          description = error.response.errors.join(', ');
      } else if (error.message) {
          description = error.message;
      }
      toast({ variant: 'destructive', title: t('update_failed'), description });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div>{t('loading')}...</div>;
  }

  return (
    <AnimatedPage>
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t('profile_page.title')}</CardTitle>
            <CardDescription>{t('profile_page.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="username" render={({ field }) => ( <FormItem><FormLabel>{t('username')}</FormLabel><FormControl><Input placeholder="your.username" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>{t('email')}</FormLabel><FormControl><Input type="email" placeholder="user@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => ( <FormItem><FormLabel>{t('phone_number')}</FormLabel><FormControl><Input placeholder="+1234567890" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>{t('address')}</FormLabel><FormControl><Input placeholder="123 Main St, Anytown" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                
                <Separator />
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>{t('profile_page.change_password')}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        <FormField control={form.control} name="newPassword" render={({ field }) => ( <FormItem><FormLabel>{t('profile_page.new_password')}</FormLabel><FormControl><Input type="password" placeholder={t('profile_page.enter_new_password')} {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => ( <FormItem><FormLabel>{t('profile_page.confirm_new_password')}</FormLabel><FormControl><Input type="password" placeholder={t('profile_page.confirm_new_password_placeholder')} {...field} /></FormControl><FormMessage /></FormItem> )} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t('saving') : t('save_changes')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}

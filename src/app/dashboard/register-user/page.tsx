
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const roles = ['ROLE_INSPECTOR', 'ROLE_ADMIN', 'ROLE_DIRECTOR'];

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  role: z.string().refine(value => roles.includes(value), {
    message: "Invalid role selected."
  }),
});

export default function RegisterUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
      role: 'ROLE_INSPECTOR',
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/auth/register', values);
      toast({ title: 'Success', description: 'User registered successfully. A verification email has been sent.' });
      form.reset();
    } catch (error: any) {
      let description = "An unknown error occurred.";
       if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
          description = error.response.errors.join(', ');
      } else if (error.message) {
          description = error.message;
      }
      toast({ variant: 'destructive', title: 'Registration Failed', description });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAdmin) {
    router.push('/dashboard');
    return null;
  }

  return (
    <AnimatedPage>
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Register New User</CardTitle>
            <CardDescription>Create a new account for an inspector, director, or admin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="username" render={({ field }) => ( <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="newuser" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="user@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
                   <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map(role => <SelectItem key={role} value={role}>{role.replace('ROLE_', '')}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => ( <FormItem><FormLabel>Phone Number (Optional)</FormLabel><FormControl><Input placeholder="+1234567890" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address (Optional)</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register User'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}

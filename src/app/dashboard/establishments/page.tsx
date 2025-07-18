
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Establishment } from '@/types';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { List, Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const establishmentSchema = z.object({
  name: z.string().min(3, { message: 'Establishment name must be at least 3 characters.' }),
});

export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const canManage = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_DIRECTOR');

  const form = useForm<z.infer<typeof establishmentSchema>>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: { name: '' },
  });
  
  const editForm = useForm<z.infer<typeof establishmentSchema>>({
    resolver: zodResolver(establishmentSchema),
  });

  const fetchEstablishments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/establishments');
      setEstablishments(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to fetch establishments' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEstablishments();
  }, [fetchEstablishments]);

  async function onSubmit(values: z.infer<typeof establishmentSchema>) {
    setIsSubmitting(true);
    try {
      await api.post('/api/establishments', values);
      toast({ title: 'Success', description: 'Establishment created successfully.' });
      form.reset();
      fetchEstablishments(); // Refresh the list
    } catch (error: any) {
        if (error.status === 409) {
          toast({ variant: 'destructive', title: 'Creation Failed', description: `An establishment named "${values.name}" already exists.` });
        } else {
            let description = "Failed to create establishment.";
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                description = error.response.errors.join(', ');
            } else if (error.message) {
                description = error.message;
            } else if (error.response?.message) {
                description = error.response.message;
            }
            toast({ variant: 'destructive', title: 'Error', description });
        }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditSubmit(values: z.infer<typeof establishmentSchema>) {
    if (!editingEstablishment) return;
    setIsSubmitting(true);
    try {
        await api.put(`/api/establishments/${editingEstablishment.id}`, { name: values.name });
        toast({ title: 'Success', description: 'Establishment updated successfully.' });
        setEditingEstablishment(null);
        fetchEstablishments();
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Update Failed', description: error.message || "Could not update establishment." });
    } finally {
        setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (editingEstablishment) {
        editForm.reset({ name: editingEstablishment.name });
    }
  }, [editingEstablishment, editForm]);


  return (
    <AnimatedPage>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Establishments</CardTitle>
              <CardDescription>List of all registered establishments.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <ul className="space-y-2">
                  {establishments.map((est) => (
                    <li key={est.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <List className="h-5 w-5 text-primary" />
                        <span className="font-medium">{est.name}</span>
                      </div>
                      {canManage && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setEditingEstablishment(est)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                        </AlertDialog>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        
        {canManage && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Create New</CardTitle>
                <CardDescription>Add a new establishment to the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Establishment Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Springfield High" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Establishment'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {editingEstablishment && (
        <AlertDialog open={!!editingEstablishment} onOpenChange={(open) => !open && setEditingEstablishment(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Establishment</AlertDialogTitle>
                    <AlertDialogDescription>
                        Update the name of the establishment. Click save when you're done.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...editForm}>
                    <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                        <FormField
                        control={editForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Establishment Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
      )}

    </AnimatedPage>
  );
}

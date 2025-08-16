
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
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
  AlertDialogTrigger,
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
  const { t } = useTranslation();
  const canManage = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_DIRECTOR');

  const form = useForm<z.infer<typeof establishmentSchema>>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: { name: '' },
  });
  
  const editForm = useForm<z.infer<typeof establishmentSchema>>({
    resolver: zodResolver(establishmentSchema),
  });

  const fetchEstablishments = useCallback(async (query = '') => {
    try {
      setLoading(true);
      const endpoint = query ? `/api/establishments/search?q=${query}` : '/api/establishments';
      const data = await api.get(endpoint);
      setEstablishments(data);
    } catch (error) {
      toast({ variant: 'destructive', title: t('establishments_page.fetch_failed') });
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchEstablishments();
  }, [fetchEstablishments]);

  async function onSubmit(values: z.infer<typeof establishmentSchema>) {
    setIsSubmitting(true);
    try {
      await api.post('/api/establishments', values);
      toast({ title: t('success'), description: t('establishments_page.create_success') });
      form.reset();
      fetchEstablishments(); // Refresh the list
    } catch (error: any) {
      toast({ variant: 'destructive', title: t('creation_failed'), description: error.message || t('establishments_page.create_failed') });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditSubmit(values: z.infer<typeof establishmentSchema>) {
    if (!editingEstablishment) return;
    setIsSubmitting(true);
    try {
        await api.put(`/api/establishments/${editingEstablishment.id}`, { name: values.name });
        toast({ title: t('success'), description: t('establishments_page.update_success') });
        setEditingEstablishment(null);
        fetchEstablishments();
    } catch (error: any) {
        toast({ variant: 'destructive', title: t('update_failed'), description: error.message || t('establishments_page.update_failed_desc') });
    } finally {
        setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (editingEstablishment) {
        editForm.reset({ name: editingEstablishment.name });
    }
  }, [editingEstablishment, editForm]);

  // const filteredEstablishments = useMemo(() => {
  //   if (!searchTerm) return establishments;
  //   const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //   return establishments.filter(est => 
  //     est.name.toLowerCase().includes(lowerCaseSearchTerm)
  //   );
  // }, [establishments, searchTerm]);


  return (
    <AnimatedPage>
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{t('establishments_page.title')}</CardTitle>
                <CardDescription>{t('establishments_page.description')}</CardDescription>
                <div className="flex items-center gap-2 pt-4">
                  <Input
                    placeholder={t('establishments_page.search_placeholder')}
                    onChange={(e) => fetchEstablishments(e.target.value)}
                  />
                </div>
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
        
        {canManage && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{t('create_new')}</CardTitle>
                <CardDescription>{t('establishments_page.create_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('establishments_page.establishment_name')}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Springfield High" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? t('creating') : t('establishments_page.create_button')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
        )}
      </div>
      
      {editingEstablishment && (
        <AlertDialog open={!!editingEstablishment} onOpenChange={(open) => !open && setEditingEstablishment(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('establishments_page.edit_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('establishments_page.edit_description')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...editForm}>
                    <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                        <FormField
                        control={editForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('establishments_page.establishment_name')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction type="submit" disabled={isSubmitting}>{isSubmitting ? t('saving') : t('save_changes')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
      )}

    </AnimatedPage>
  );
}


"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Teacher } from '@/types';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

const teacherSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const canManage = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_DIRECTOR');

  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
  });

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/teachers');
      setTeachers(data);
    } catch (error) {
      toast({ variant: 'destructive', title: t('teachers_page.fetch_failed_title'), description: t('teachers_page.fetch_failed_desc') });
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  async function handleEditSubmit(values: z.infer<typeof teacherSchema>) {
    if (!editingTeacher) return;
    setIsSubmitting(true);
    try {
      await api.put(`/api/teachers/${editingTeacher.id}`, values);
      toast({ title: t('success'), description: t('teachers_page.update_success') });
      setEditingTeacher(null);
      fetchTeachers();
    } catch (error: any) {
      let description = t('teachers_page.update_failed_desc_generic');
      if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
          description = error.response.errors.join(', ');
      } else if (error.message) {
          description = error.message;
      }
      toast({ variant: 'destructive', title: t('update_failed'), description });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (editingTeacher) {
      form.reset({
        firstName: editingTeacher.firstName,
        lastName: editingTeacher.lastName,
        email: editingTeacher.email || '',
        phone: editingTeacher.phone || '',
        gender: editingTeacher.gender,
      });
    }
  }, [editingTeacher, form]);

  const handleOpenDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
  };
  
  const handleCloseDialog = () => {
    setEditingTeacher(null);
  }

  return (
    <AnimatedPage>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t('teachers_page.title')}</CardTitle>
          <CardDescription>{t('teachers_page.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">{t('teachers_page.teacher_id')}</TableHead>
                  <TableHead>{t('first_name')}</TableHead>
                  <TableHead>{t('last_name')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('email')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('phone')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('gender')}</TableHead>
                  {canManage && <TableHead className="text-right">{t('actions')}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[180px]" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-[80px]" /></TableCell>
                      {canManage && <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>}
                    </TableRow>
                  ))
                ) : (
                  teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="hidden sm:table-cell">{teacher.teacherId || 'N/A'}</TableCell>
                      <TableCell>{teacher.firstName}</TableCell>
                      <TableCell>{teacher.lastName}</TableCell>
                      <TableCell className="hidden md:table-cell">{teacher.email || 'N/A'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{teacher.phone || 'N/A'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{teacher.gender || 'N/A'}</TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(teacher)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {editingTeacher && (
        <AlertDialog open={!!editingTeacher} onOpenChange={(open) => !open && handleCloseDialog()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('teachers_page.edit_title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('teachers_page.edit_description', { id: editingTeacher.teacherId || editingTeacher.id })}</AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>{t('first_name')}</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>{t('last_name')}</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>{t('email')}</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>{t('phone')}</FormLabel><FormControl><Input placeholder="+123456789" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="gender" render={({ field }) => ( 
                            <FormItem>
                                <FormLabel>{t('gender')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder={t('teachers_page.select_gender')} /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="MALE">{t('male')}</SelectItem>
                                        <SelectItem value="FEMALE">{t('female')}</SelectItem>
                                        <SelectItem value="OTHER">{t('other')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem> 
                        )}/>
                       </div>
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

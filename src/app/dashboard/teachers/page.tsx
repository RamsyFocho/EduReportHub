
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
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
  teacherId: z.string().optional(),
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
      toast({ variant: 'destructive', title: 'Failed to fetch teachers', description: "Could not load the list of teachers." });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  async function handleEditSubmit(values: z.infer<typeof teacherSchema>) {
    if (!editingTeacher) return;
    setIsSubmitting(true);
    try {
      await api.put(`/api/teachers/${editingTeacher.id}`, values);
      toast({ title: 'Success', description: 'Teacher updated successfully.' });
      setEditingTeacher(null);
      fetchTeachers();
    } catch (error: any) {
      let description = "Could not update teacher.";
      if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
          description = error.response.errors.join(', ');
      } else if (error.message) {
          description = error.message;
      }
      toast({ variant: 'destructive', title: 'Update Failed', description });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (editingTeacher) {
      form.reset({
        firstName: editingTeacher.firstName,
        lastName: editingTeacher.lastName,
        teacherId: editingTeacher.teacherId || '',
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
          <CardTitle className="font-headline text-2xl">Teachers</CardTitle>
          <CardDescription>View and manage all registered teachers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
                {canManage && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    {canManage && <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>}
                  </TableRow>
                ))
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.teacherId || 'N/A'}</TableCell>
                    <TableCell>{teacher.firstName}</TableCell>
                    <TableCell>{teacher.lastName}</TableCell>
                    <TableCell>{teacher.email || 'N/A'}</TableCell>
                    <TableCell>{teacher.phone || 'N/A'}</TableCell>
                    <TableCell>{teacher.gender || 'N/A'}</TableCell>
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
        </CardContent>
      </Card>
      
      {editingTeacher && (
        <AlertDialog open={!!editingTeacher} onOpenChange={(open) => !open && handleCloseDialog()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Teacher</AlertDialogTitle>
                    <AlertDialogDescription>Update the teacher's details.</AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="teacherId" render={({ field }) => ( <FormItem><FormLabel>Teacher ID</FormLabel><FormControl><Input placeholder="T-12345" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+123456789" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="gender" render={({ field }) => ( 
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem> 
                        )}/>
                       </div>
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

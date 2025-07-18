
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Establishment, Teacher } from '@/types';

const reportSchema = z.object({
  establishmentName: z.string().nonempty({ message: 'Establishment is required.' }),
  teacherLastName: z.string().nonempty({ message: 'Teacher is required.' }),
  className: z.string().nonempty({ message: 'Class name is required.' }),
  courseTitle: z.string().nonempty({ message: 'Course title is required.' }),
  date: z.date({ required_error: 'A date is required.' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  presentStudents: z.coerce.number().min(0),
  absentStudents: z.coerce.number().min(0),
  observation: z.string().nonempty({ message: 'Observation is required.' }),
});

export default function NewReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estData, teacherData] = await Promise.all([
          api.get('/api/establishments'),
          api.get('/api/teachers'), 
        ]);
        setEstablishments(estData);
        setTeachers(teacherData || []);
      } catch (error) {
         toast({ variant: "destructive", title: "Failed to load data", description: "Could not load establishments or teachers." });
      }
    };
    fetchData();
  }, [toast]);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
        startTime: "08:00",
        endTime: "09:00",
        presentStudents: 0,
        absentStudents: 0
    }
  });

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    setIsLoading(true);
    const payload = {
      establishment: { name: values.establishmentName },
      teacher: { lastName: values.teacherLastName },
      className: values.className,
      courseTitle: values.courseTitle,
      date: format(values.date, 'yyyy-MM-dd'),
      startTime: `${values.startTime}:00`,
      endTime: `${values.endTime}:00`,
      presentStudents: values.presentStudents,
      absentStudents: values.absentStudents,
      observation: values.observation,
      sanctionType: "NONE",
    };

    try {
      await api.post('/api/reports', payload);
      toast({ title: 'Success', description: 'Report created successfully.' });
      router.push('/dashboard/reports');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error instanceof Error ? error.message : "Failed to create report." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatedPage>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create New Report</CardTitle>
          <CardDescription>Fill in the details of the inspection.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="establishmentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Establishment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select an establishment" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {establishments.map(e => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teacherLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {teachers.map(t => <SelectItem key={t.id} value={t.lastName}>{t.firstName} {t.lastName}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="className" render={({ field }) => (<FormItem><FormLabel>Class Name</FormLabel><FormControl><Input placeholder="e.g., 10A" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="courseTitle" render={({ field }) => (<FormItem><FormLabel>Course Title</FormLabel><FormControl><Input placeholder="e.g., Mathematics" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="startTime" render={({ field }) => (<FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="endTime" render={({ field }) => (<FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="presentStudents" render={({ field }) => (<FormItem><FormLabel>Present Students</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="absentStudents" render={({ field }) => (<FormItem><FormLabel>Absent Students</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>
               <FormField control={form.control} name="observation" render={({ field }) => (<FormItem><FormLabel>Observation</FormLabel><FormControl><Textarea placeholder="Describe your observations..." className="resize-y min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>)} />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit Report'}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}

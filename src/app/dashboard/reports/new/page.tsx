"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Establishment, Teacher } from '@/types';

const reportSchema = z.object({
  establishmentName: z.string().nonempty({ message: 'Establishment is required.' }),
  teacherFullName: z.string().nonempty({ message: 'Teacher is required.' }),
  className: z.string().nonempty({ message: 'Class name is required.' }),
  courseTitle: z.string().nonempty({ message: 'Course title is required.' }),
  date: z.date({ required_error: 'A date is required.' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  studentNum: z.coerce.number().min(0, 'Total students cannot be negative.'),
  studentPresent: z.coerce.number().min(0, 'Present students cannot be negative.'),
  observation: z.string().nonempty({ message: 'Observation is required.' }),
}).refine(data => {
    const start = parseInt(data.startTime.replace(':', ''), 10);
    const end = parseInt(data.endTime.replace(':', ''), 10);
    return end > start;
}, {
    message: 'End time must be after start time.',
    path: ['endTime'],
}).refine(data => data.studentPresent <= data.studentNum, {
    message: 'Present students cannot exceed total students.',
    path: ['studentPresent'],
});

export default function NewReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estData, teacherData] = await Promise.all([
          api.get("/api/establishments"),
          api.get("/api/teachers"),
        ]);
        setEstablishments(estData);
        setTeachers(teacherData || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: t("new_report_page.load_failed_title"),
          description: error.message || t("new_report_page.load_failed_desc"),
        });
      }
    };
    fetchData();
  }, [toast, t]);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
        startTime: "08:00",
        endTime: "09:00",
        studentNum: 0,
        studentPresent: 0,
    }
  });

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    setIsLoading(true);
    
    const [firstName, ...lastNameParts] = values.teacherFullName.split(' ');
    const lastName = lastNameParts.join(' ');

    const payload = {
      establishmentName: values.establishmentName,

      teacherFirstName: selectedTeacher?.firstName,
      teacherLastName: selectedTeacher?.lastName,
      teacherEmail: selectedTeacher?.email,
      className: values.className,
      studentNum: values.totalStudents,
      studentPresent: values.presentStudents,
      date: format(values.date, "yyyy-MM-dd"),
      startTime: `${values.startTime}:00`,
      endTime: `${values.endTime}:00`,

      courseTitle: values.courseTitle,

      studentNum: values.studentNum,
      studentPresent: values.studentPresent,

      observation: values.observation,
      sanctionType: "NONE",
    };

    console.log('Report creation payload:', payload);

    try {
      await api.post("/api/reports", payload);
      toast({
        title: t("success"),
        description: t("new_report_page.create_success"),
      });
      router.push("/dashboard/reports");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message || t("new_report_page.create_failed"),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatedPage>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            {t("new_report_page.title")}
          </CardTitle>
          <CardDescription>{t("new_report_page.description")}</CardDescription>
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
                      <FormLabel>{t("establishment")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "new_report_page.select_establishment"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {establishments.map((e) => (
                            <SelectItem key={e.id} value={e.name}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teacherFullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("teacher")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("new_report_page.select_teacher")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((t) => (
                            <SelectItem
                              key={t.id}
                              value={`${t.firstName} ${t.lastName}`}
                            >
                              {t.firstName} {t.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="className"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("new_report_page.class_name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 10A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("new_report_page.course_title")}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mathematics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("date")}</FormLabel>
                      <div
                        className={cn(
                          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted px-3 py-2 text-sm"
                        )}
                      >
                        {format(field.value, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("new_report_page.start_time")}</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("new_report_page.end_time")}</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentNum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("reports_page.total_students")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentPresent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("new_report_page.present_students")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("new_report_page.observation")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "new_report_page.observation_placeholder"
                        )}
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? t("submitting")
                    : t("new_report_page.submit_button")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}

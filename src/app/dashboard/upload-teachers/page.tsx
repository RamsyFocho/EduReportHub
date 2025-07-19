
"use client";

import { useState } from 'react';
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
import { Upload } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv'
];

const uploadSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'File is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.xlsx, .xls, or .csv files are accepted.'
    ),
});

export default function UploadTeachersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const canUpload = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_DIRECTOR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
  });
  
  const fileRef = form.register('file');

  async function onSubmit(values: z.infer<typeof uploadSchema>) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', values.file[0]);

    try {
      await api.postFormData('/api/teachers/upload', formData);
      toast({ title: t('success'), description: t('upload_teachers_page.success_desc') });
      form.reset();
      setFileName('');
    } catch (error: any) {
      let description = t('upload_teachers_page.failed_desc_generic');
      if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
          description = error.response.errors.join(', ');
      } else if (error.message) {
          description = error.message;
      }
      toast({ variant: 'destructive', title: t('upload_failed'), description });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (!canUpload) {
    router.push('/dashboard');
    return null;
  }

  return (
    <AnimatedPage>
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t('upload_teachers_page.title')}</CardTitle>
            <CardDescription>{t('upload_teachers_page.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('upload_teachers_page.file_label')}</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center justify-center w-full">
                          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">{t('click_to_upload')}</span> {t('or_drag_and_drop')}
                              </p>
                              <p className="text-xs text-muted-foreground">{t('upload_teachers_page.file_types')}</p>
                              {fileName && <p className="mt-4 text-sm font-medium text-foreground">{fileName}</p>}
                            </div>
                            <Input 
                                id="file-upload" 
                                type="file" 
                                className="hidden" 
                                {...fileRef}
                                onChange={(event) => {
                                    field.onChange(event.target.files);
                                    setFileName(event.target.files?.[0]?.name || '');
                                }}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t('uploading') : t('upload_teachers_page.upload_button')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}

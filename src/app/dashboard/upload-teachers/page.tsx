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
import { Upload } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

const uploadSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'File is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.xlsx, .xls files are accepted.'
    ),
});

export default function UploadTeachersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
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
      toast({ title: 'Success', description: 'Teachers uploaded successfully.' });
      form.reset();
      setFileName('');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error instanceof Error ? error.message : "An unknown error occurred." });
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
            <CardTitle className="font-headline text-2xl">Upload Teachers</CardTitle>
            <CardDescription>Bulk upload teacher data from an Excel file (.xlsx, .xls).</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher Data File</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center justify-center w-full">
                          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">Excel (.xlsx, .xls) up to 5MB</p>
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
                  {isSubmitting ? 'Uploading...' : 'Upload File'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}

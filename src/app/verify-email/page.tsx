
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle } from 'lucide-react';
import { AnimatedPage } from '@/components/shared/AnimatedPage';

function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const { t } = useTranslation();
  const [message, setMessage] = useState(t('verify_email_page.verifying_message'));

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('verify_email_page.missing_token'));
      return;
    }

    const verifyToken = async () => {
      try {
        await api.get(`/api/auth/verify?token=${token}`);
        setStatus('success');
        setMessage(t('verify_email_page.success_message'));
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : t('verify_email_page.error_message'));
      }
    };

    verifyToken();
  }, [token, router, t]);

  const getTitle = () => {
      switch(status) {
          case 'verifying': return t('verify_email_page.verifying_title');
          case 'success': return t('verify_email_page.success_title');
          case 'error': return t('verify_email_page.error_title');
      }
  }

  return (
    <AnimatedPage>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-fit">
              {status === 'verifying' && <Skeleton className="h-12 w-12 rounded-full" />}
              {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
              {status === 'error' && <XCircle className="h-12 w-12 text-destructive" />}
            </div>
            <CardTitle className="font-headline text-2xl mt-4">
              {getTitle()}
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          {status !== 'verifying' && (
            <CardContent>
              <Button asChild>
                <Link href="/">{t('verify_email_page.go_to_login')}</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </AnimatedPage>
  );
}


export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerificationContent />
        </Suspense>
    )
}

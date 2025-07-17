"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
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
  const [message, setMessage] = useState('Verifying your email, please wait...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing. Please check your link.');
      return;
    }

    const verifyToken = async () => {
      try {
        // The API redirects, but we can check the response status for success before it does.
        // A more robust way would be for the API to return JSON on success/failure.
        // Assuming the API call itself is what matters.
        await api.get(`/auth/verify?token=${token}`);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in.');
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to verify email. The link may have expired.');
      }
    };

    verifyToken();
  }, [token, router]);

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
              {status === 'verifying' && 'Verifying...'}
              {status === 'success' && 'Verification Successful'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          {status !== 'verifying' && (
            <CardContent>
              <Button asChild>
                <Link href="/">Go to Login</Link>
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

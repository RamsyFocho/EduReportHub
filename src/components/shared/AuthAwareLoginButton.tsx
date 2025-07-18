
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

export function AuthAwareLoginButton() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <Button disabled>{t('login')}</Button>;
  }

  return (
    <Button asChild>
      <Link href={isAuthenticated ? "/dashboard" : "/login"}>{t('login')}</Link>
    </Button>
  );
}

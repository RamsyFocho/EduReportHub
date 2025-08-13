
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpenCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
            <div className="flex items-center gap-3 text-2xl font-headline font-semibold text-primary">
                <BookOpenCheck className="h-8 w-8" />
                <span>{t('app_name')}</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-[150px]" />
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
        <div className="flex min-h-screen border-2 w-full">
            <DashboardSidebar />
            <SidebarInset>
                <DashboardHeader />
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {children}
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}

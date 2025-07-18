"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building2, Users, ShieldCheck } from "lucide-react";
import { AnimatedPage } from "@/components/shared/AnimatedPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isDirector = user?.roles?.includes("ROLE_DIRECTOR");

  const stats = [
    {
      title: "Total Reports",
      value: "1,234",
      description: "+20.1% from last month",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_ADMIN", "ROLE_DIRECTOR"]
    },
    {
      title: "My Reports",
      value: "82",
      description: "3 created this week",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_INSPECTOR"]
    },
    {
      title: "Establishments",
      value: "57",
      description: "+2 since last week",
      icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_ADMIN", "ROLE_DIRECTOR"]
    },
    {
      title: "Active Teachers",
      value: "789",
      description: "Across all establishments",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_ADMIN", "ROLE_DIRECTOR"]
    },
     {
      title: "My Sanctions",
      value: "5",
      description: "1 warning issued",
      icon: <ShieldCheck className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_INSPECTOR"]
    },
  ];

  const userStats = stats.filter(stat => user?.roles?.some(role => stat.roles.includes(role)));

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}! Here's your hub overview.</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader><Skeleton className="h-5 w-2/4" /></CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-7 w-1/3" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
             ))
          ) : (
            userStats.map((stat, index) => (
              <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      {stat.icon}
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold font-headline mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
             <Button asChild>
                <Link href="/dashboard/reports/new">Create New Report</Link>
             </Button>
             {(isAdmin || isDirector) && (
                <>
                    <Button asChild variant="secondary">
                        <Link href="/dashboard/upload-teachers">Upload Teachers</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/dashboard/establishments">Manage Establishments</Link>
                    </Button>
                </>
             )}
             {isAdmin && (
                <Button asChild variant="secondary">
                    <Link href="/dashboard/register-user">Register New User</Link>
                </Button>
             )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

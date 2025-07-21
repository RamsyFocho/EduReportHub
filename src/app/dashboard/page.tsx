
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts"
import { FileText, Building2, Users, ShieldCheck } from "lucide-react";
import { AnimatedPage } from "@/components/shared/AnimatedPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getReportsByEstablishment, getMonthlyReportTrends } from "@/services/api/dashboard";
import { useToast } from "@/hooks/use-toast";

const barChartConfig = {
  reports: {
    label: "Reports",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const lineChartConfig = {
  reports: {
    label: "Reports",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isDirector = user?.roles?.includes("ROLE_DIRECTOR");
  const isInspector = user?.roles?.includes("ROLE_INSPECTOR");

  const [statsLoading, setStatsLoading] = useState(true);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    async function fetchChartData() {
        try {
            setStatsLoading(true);
            const [establishmentData, trendsData] = await Promise.all([
                getReportsByEstablishment(),
                getMonthlyReportTrends()
            ]);
            setBarChartData(establishmentData);
            setLineChartData(trendsData);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to load dashboard data.' });
        } finally {
            setStatsLoading(false);
        }
    }
    fetchChartData();
  }, [toast]);


  const stats = [
    {
      title: "dashboard.total_reports",
      value: "1,234",
      description: "dashboard.reports_last_month",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_ADMIN", "ROLE_DIRECTOR"]
    },
    {
      title: "dashboard.my_reports",
      value: "82",
      description: "dashboard.reports_this_week",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_INSPECTOR"]
    },
    {
      title: "dashboard.establishments",
      value: "57",
      description: "dashboard.establishments_since_last_week",
      icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_ADMIN", "ROLE_DIRECTOR"]
    },
    {
      title: "dashboard.active_teachers",
      value: "789",
      description: "dashboard.teachers_across_establishments",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_ADMIN", "ROLE_DIRECTOR"]
    },
     {
      title: "dashboard.my_sanctions",
      value: "5",
      description: "dashboard.sanctions_issued",
      icon: <ShieldCheck className="h-4 w-4 text-muted-foreground" />,
      roles: ["ROLE_INSPECTOR"]
    },
  ];

  const userStats = stats.filter(stat => user?.roles?.some(role => stat.roles.includes(role)));

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.welcome_back', { email: user?.email })}</p>
        
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
                      <CardTitle className="text-sm font-medium">{t(stat.title)}</CardTitle>
                      {stat.icon}
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{t(stat.description)}</p>
                  </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 space-y-8">
            <h2 className="text-2xl font-semibold font-headline">{t('dashboard.analytics_overview')}</h2>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.reports_by_establishment')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {statsLoading ? <Skeleton className="h-[250px] w-full" /> : (
                            <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                                <BarChart accessibilityLayer data={barChartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="establishment" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="reports" fill="var(--color-reports)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                         )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.monthly_report_trends')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? <Skeleton className="h-[250px] w-full" /> : (
                            <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
                                <LineChart accessibilityLayer data={lineChartData} margin={{ left: 12, right: 12 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Line dataKey="reports" type="natural" stroke="var(--color-reports)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

        <Separator />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold font-headline mb-4">{t('dashboard.quick_actions')}</h2>
          <div className="flex flex-wrap gap-4">
             {isInspector && (
                <Button asChild>
                    <Link href="/dashboard/reports/new">{t('dashboard.create_new_report')}</Link>
                </Button>
             )}
             {(isAdmin || isDirector) && (
                <>
                    <Button asChild variant="secondary">
                        <Link href="/dashboard/upload-teachers">{t('dashboard.upload_teachers')}</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/dashboard/establishments">{t('dashboard.manage_establishments')}</Link>
                    </Button>
                </>
             )}
             {isAdmin && (
                <Button asChild variant="secondary">
                    <Link href="/dashboard/register-user">{t('dashboard.register_new_user')}</Link>
                </Button>
             )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

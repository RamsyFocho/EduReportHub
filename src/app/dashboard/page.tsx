"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building2, Users } from "lucide-react";
import { AnimatedPage } from "@/components/shared/AnimatedPage";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}! Here's your hub overview.</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Establishments</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">57</div>
                    <p className="text-xs text-muted-foreground">+2 since last week</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">789</div>
                    <p className="text-xs text-muted-foreground">Across all establishments</p>
                </CardContent>
            </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold font-headline mb-4">Quick Actions</h2>
          <div className="flex gap-4">
             <a href="/dashboard/reports/new" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">Create New Report</a>
             {isAdmin && <a href="/dashboard/register-user" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md">Register New User</a>}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

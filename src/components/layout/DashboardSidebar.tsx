
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  BookOpenCheck,
  LayoutDashboard,
  FileText,
  Building2,
  UserPlus,
  Upload,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isDirector = user?.roles?.includes("ROLE_DIRECTOR");

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    {
      href: "/dashboard",
      labelKey: "dashboard.title",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/reports",
      labelKey: "reports_page.title",
      icon: FileText,
    },
    {
      href: "/dashboard/establishments",
      labelKey: "establishments_page.title",
      icon: Building2,
    },
     {
      href: "/dashboard/teachers",
      labelKey: "teachers_page.title",
      icon: Users,
    },
  ];

  const managementMenuItems = [
    {
        href: "/dashboard/upload-teachers",
        labelKey: "upload_teachers_page.title",
        icon: Upload,
        roles: ["ROLE_ADMIN", "ROLE_DIRECTOR"]
    }
  ];

  const adminMenuItems = [
      {
        href: "/dashboard/register-user",
        labelKey: "register_user_page.title",
        icon: UserPlus,
        roles: ["ROLE_ADMIN"]
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
            <Button variant="ghost" className="h-10 w-10 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <BookOpenCheck className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold font-headline">{t('app_name_short')}</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  icon={item.icon}
                  tooltip={t(item.labelKey)}
                >
                  {t(item.labelKey)}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {(isAdmin || isDirector) && (
            <SidebarGroup>
                <SidebarGroupLabel>{t('management')}</SidebarGroupLabel>
                <SidebarMenu>
                {managementMenuItems.filter(item => user?.roles?.some(role => item.roles.includes(role))).map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={pathname === item.href}
                        icon={item.icon}
                        tooltip={t(item.labelKey)}
                        >
                        {t(item.labelKey)}
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroup>
        )}

        {isAdmin && (
            <SidebarGroup>
                <SidebarGroupLabel>{t('admin')}</SidebarGroupLabel>
                <SidebarMenu>
                {adminMenuItems.filter(item => user?.roles?.some(role => item.roles.includes(role))).map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={pathname === item.href}
                        icon={item.icon}
                        tooltip={t(item.labelKey)}
                        >
                        {t(item.labelKey)}
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">{t('logout')}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}


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

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isDirector = user?.roles?.includes("ROLE_DIRECTOR");

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/reports",
      label: "Reports",
      icon: FileText,
    },
    {
      href: "/dashboard/establishments",
      label: "Establishments",
      icon: Building2,
    },
     {
      href: "/dashboard/teachers",
      label: "Teachers",
      icon: Users,
    },
  ];

  const managementMenuItems = [
    {
        href: "/dashboard/upload-teachers",
        label: "Upload Teachers",
        icon: Upload,
        roles: ["ROLE_ADMIN", "ROLE_DIRECTOR"]
    }
  ];

  const adminMenuItems = [
      {
        href: "/dashboard/register-user",
        label: "Register User",
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
            <h1 className="text-xl font-semibold font-headline">EduReport</h1>
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
                  tooltip={item.label}
                >
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {(isAdmin || isDirector) && (
            <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <SidebarMenu>
                {managementMenuItems.filter(item => user?.roles?.some(role => item.roles.includes(role))).map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={pathname === item.href}
                        icon={item.icon}
                        tooltip={item.label}
                        >
                        {item.label}
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroup>
        )}

        {isAdmin && (
            <SidebarGroup>
                <SidebarGroupLabel>Admin</SidebarGroupLabel>
                <SidebarMenu>
                {adminMenuItems.filter(item => user?.roles?.some(role => item.roles.includes(role))).map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={pathname === item.href}
                        icon={item.icon}
                        tooltip={item.label}
                        >
                        {item.label}
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" onClick={logout} className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

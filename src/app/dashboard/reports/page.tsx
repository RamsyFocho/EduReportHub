
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Report } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedPage } from "@/components/shared/AnimatedPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const canUpdateSanction = user?.roles?.includes("ROLE_ADMIN") || user?.roles?.includes("ROLE_DIRECTOR");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/reports");
      // Safely access the content array from the paginated response
      setReports(data && Array.isArray(data.content) ? data.content : []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch reports",
        description: error instanceof Error ? error.message : "Could not load reports.",
      });
      setReports([]); // Ensure reports is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSanctionUpdate = async (reportId: number, sanctionType: "NONE" | "WARNING" | "SUSPENSION" | "COMMENDATION") => {
    setIsUpdating(true);
    try {
      await api.put(`/api/reports/sanction/${reportId}`, { id: reportId, sanctionType });
      toast({ title: "Success", description: "Report sanction updated." });
      fetchReports(); // Refresh the list
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update sanction.",
      });
    } finally {
        setIsUpdating(false);
    }
  };

  const filteredReports = reports.filter(report => 
    (report.teacher?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (report.teacher?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (report.establishment?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (report.courseTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (report.createdBy?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  const getSanctionVariant = (sanction: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (sanction) {
        case "WARNING":
        case "SUSPENSION":
            return "destructive";
        case "COMMENDATION":
            return "default";
        case "NONE":
        default:
            return "secondary";
    }
  };

  return (
    <AnimatedPage>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Reports</CardTitle>
                <CardDescription>View, search, and manage all inspection reports.</CardDescription>
            </div>
            <Link href="/dashboard/reports/new" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Report
                </Button>
            </Link>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search" 
                placeholder="Search by teacher, establishment, course, inspector..." 
                className="pl-8 sm:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Establishment</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sanction</TableHead>
                {canUpdateSanction && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                    {canUpdateSanction && <TableCell><Skeleton className="h-6 w-[30px] rounded-md ml-auto" /></TableCell>}
                  </TableRow>
                ))
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.teacher ? `${report.teacher.firstName} ${report.teacher.lastName}`: 'N/A'}</TableCell>
                    <TableCell>{report.establishment?.name || 'N/A'}</TableCell>
                    <TableCell>{report.createdBy?.username || 'N/A'}</TableCell>
                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant={getSanctionVariant(report.sanctionType)}>{report.sanctionType}</Badge>
                    </TableCell>
                    {canUpdateSanction && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.id, 'COMMENDATION')}>
                              Set to Commendation
                            </DropdownMenuItem>
                             <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.id, 'NONE')}>
                              Set to None
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.id, 'WARNING')}>
                              Set to Warning
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.id, 'SUSPENSION')}>
                              Set to Suspension
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canUpdateSanction ? 6 : 5} className="text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}

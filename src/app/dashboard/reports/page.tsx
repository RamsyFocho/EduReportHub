
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, MoreHorizontal, Eye } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const canUpdateSanction = user?.roles?.includes("ROLE_ADMIN") || user?.roles?.includes("ROLE_DIRECTOR");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/reports");
      setReports(data && Array.isArray(data.content) ? data.content : []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch reports",
        description: error instanceof Error ? error.message : "Could not load reports.",
      });
      setReports([]);
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
      fetchReports();
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
                <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell><Skeleton className="h-6 w-[80px] rounded-md ml-auto" /></TableCell>
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
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Button>
                        {canUpdateSanction && (
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
                        )}
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-3xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Report Details</DialogTitle>
                <DialogDescription>
                  Full details for the inspection conducted on {new Date(selectedReport.date).toLocaleDateString()}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div><span className="font-semibold text-muted-foreground">Inspector:</span> {selectedReport.createdBy.username}</div>
                    <div><span className="font-semibold text-muted-foreground">Course:</span> {selectedReport.courseTitle}</div>
                    <div><span className="font-semibold text-muted-foreground">Class:</span> {selectedReport.className}</div>
                    <div><span className="font-semibold text-muted-foreground">Establishment:</span> {selectedReport.establishment.name}</div>
                    <div><span className="font-semibold text-muted-foreground">Teacher:</span> {`${selectedReport.teacher.firstName} ${selectedReport.teacher.lastName}`}</div>
                    <div><span className="font-semibold text-muted-foreground">Date:</span> {new Date(selectedReport.date).toLocaleDateString()}</div>
                    <div><span className="font-semibold text-muted-foreground">Time:</span> {selectedReport.startTime} - {selectedReport.endTime}</div>
                    <div>
                        <span className="font-semibold text-muted-foreground">Sanction:</span> 
                        <Badge variant={getSanctionVariant(selectedReport.sanctionType)} className="ml-2">{selectedReport.sanctionType}</Badge>
                    </div>
                </div>

                <Separator />

                {/* Attendance */}
                <div>
                    <h3 className="font-semibold text-lg mb-2">Attendance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
                        <div><span className="font-semibold text-muted-foreground">Present:</span> {selectedReport.presentStudents}</div>
                        <div><span className="font-semibold text-muted-foreground">Absent:</span> {selectedReport.absentStudents}</div>
                        <div><span className="font-semibold text-muted-foreground">Total:</span> {selectedReport.totalStudents}</div>
                    </div>
                </div>

                <Separator />
                
                {/* Observation */}
                <div>
                    <h3 className="font-semibold text-lg mb-2">Inspector's Observation</h3>
                    <p className="text-sm text-foreground bg-muted p-3 rounded-md">{selectedReport.observation}</p>
                </div>

                <Separator />

                 {/* Timestamps */}
                <div>
                    <h3 className="font-semibold text-lg mb-2">Timestamps</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                        <div><span className="font-semibold">Created:</span> {new Date(selectedReport.createdAt).toLocaleString()}</div>
                        <div><span className="font-semibold">Last Updated:</span> {new Date(selectedReport.updatedAt).toLocaleString()}</div>
                    </div>
                </div>

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  );
}

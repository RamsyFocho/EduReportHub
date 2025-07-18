
"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, MoreHorizontal, Eye, Eraser } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

type SearchType = "teacher" | "establishment" | "class" | "course" | "description";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("teacher");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const canUpdateSanction = user?.roles?.includes("ROLE_ADMIN") || user?.roles?.includes("ROLE_DIRECTOR");

  const fetchReports = useCallback(async (endpoint = "/api/reports") => {
    try {
      setLoading(true);
      const data = await api.get(endpoint);
      console.log("Data from backend:", data);

      if (Array.isArray(data)) { // Direct array response
        setReports(data);
      } else if (data && Array.isArray(data.content)) { // Paginated response
        setReports(data.content);
      } else {
        setReports([]);
        console.warn("API response was not a recognized format.", data);
      }
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
  }, [toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
        fetchReports(); // fetch all if search term is empty
        return;
    }
    const endpoints: Record<SearchType, string> = {
        teacher: `/api/reports/search/teacher?name=${searchTerm}`,
        establishment: `/api/reports/search/establishment?name=${searchTerm}`,
        class: `/api/reports/search/class?name=${searchTerm}`,
        course: `/api/reports/search/course?title=${searchTerm}`,
        description: `/api/reports/search/description?keyword=${searchTerm}`
    };
    fetchReports(endpoints[searchType]);
  };
  
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchType("teacher");
    fetchReports();
  }

  const handleSanctionUpdate = async (reportId: number, sanctionType: "NONE" | "WARNING" | "SUSPENSION" | "COMMENDATION") => {
    setIsUpdating(true);
    try {
      await api.put(`/api/reports/sanction/${reportId}`, { id: reportId, sanctionType });
      toast({ title: "Success", description: "Report sanction updated." });
      // Refetch the currently displayed list
      if (searchTerm.trim()) {
          handleSearch();
      } else {
          fetchReports();
      }
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
  
  const getSanctionVariant = (sanction: string | null): "default" | "destructive" | "secondary" | "outline" => {
    switch (sanction) {
        case "WARNING":
        case "SUSPENSION":
            return "destructive";
        case "COMMENDATION":
            return "default";
        case "NONE":
        case null:
        default:
            return "secondary";
    }
  };

  return (
    <AnimatedPage>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
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
          <div className="flex items-center gap-2 mt-4">
            <Select value={searchType} onValueChange={(value) => setSearchType(value as SearchType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Search by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="establishment">Establishment</SelectItem>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="description">Description</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-grow">
              <Input 
                  type="search" 
                  placeholder={`Search by ${searchType}...`}
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4" />Search</Button>
            <Button variant="ghost" onClick={handleClearSearch}><Eraser className="mr-2 h-4 w-4" />Clear</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Establishment</TableHead>
                <TableHead>Course</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[150px] rounded-md ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.id || report.reportId}>
                    <TableCell>{report.teacher ? `${report.teacher.firstName} ${report.teacher.lastName}`: 'N/A'}</TableCell>
                    <TableCell>{report.establishment?.name || 'N/A'}</TableCell>
                    <TableCell>{report.courseTitle || 'N/A'}</TableCell>
                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant={getSanctionVariant(report.sanctionType)}>{report.sanctionType || 'NONE'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
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
                                <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.id || report.reportId, 'COMMENDATION')}>Set to Commendation</DropdownMenuItem>
                                <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.id || report.reportId, 'NONE')}>Set to None</DropdownMenuItem>
                                <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.id || report.reportId, 'WARNING')}>Set to Warning</DropdownMenuItem>
                                <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.id || report.reportId, 'SUSPENSION')}>Set to Suspension</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-4xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Report Details (ID: {selectedReport.id || selectedReport.reportId})</DialogTitle>
                <DialogDescription>
                  Full details for the inspection conducted on {new Date(selectedReport.date).toLocaleDateString()}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Inspector</span> <span className="font-medium">{selectedReport.createdBy?.username || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Establishment</span> <span className="font-medium">{selectedReport.establishment?.name || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Teacher</span> <span className="font-medium">{selectedReport.teacher ? `${selectedReport.teacher.firstName} ${selectedReport.teacher.lastName}`: 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Course</span> <span className="font-medium">{selectedReport.courseTitle}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Class</span> <span className="font-medium">{selectedReport.className}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Date</span> <span className="font-medium">{new Date(selectedReport.date).toLocaleDateString()}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Time</span> <span className="font-medium">{selectedReport.startTime} - {selectedReport.endTime}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Sanction</span> <Badge variant={getSanctionVariant(selectedReport.sanctionType)} className="w-fit">{selectedReport.sanctionType || 'NONE'}</Badge></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Sanction Date</span> <span className="font-medium">{selectedReport.dateIssued ? new Date(selectedReport.dateIssued).toLocaleDateString() : 'N/A'}</span></div>
                </div>

                <Separator />
                
                <h3 className="font-semibold text-lg">Attendance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Present Students</span> <span className="font-medium">{selectedReport.presentStudents ?? selectedReport.studentPresent ?? 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Absent Students</span> <span className="font-medium">{selectedReport.absentStudents ?? 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">Total Students</span> <span className="font-medium">{selectedReport.totalStudents ?? selectedReport.studentNum ?? 'N/A'}</span></div>
                </div>

                <Separator />
                
                <div>
                    <h3 className="font-semibold text-lg mb-2">Inspector's Observation</h3>
                    <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">{selectedReport.observation}</p>
                </div>
                
                {selectedReport.description && (
                  <div>
                      <h3 className="font-semibold text-lg mb-2">Sanction Description</h3>
                      <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                )}
                
                {selectedReport.createdAt && selectedReport.updatedAt && (
                  <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Timestamps</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                            <div><span className="font-semibold">Created:</span> {new Date(selectedReport.createdAt).toLocaleString()}</div>
                            <div><span className="font-semibold">Last Updated:</span> {new Date(selectedReport.updatedAt).toLocaleString()}</div>
                        </div>
                    </div>
                  </>
                )}

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  );
}

    
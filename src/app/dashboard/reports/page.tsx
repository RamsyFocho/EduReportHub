

"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Report } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation();
  const canUpdateSanction = user?.roles?.includes("ROLE_ADMIN") || user?.roles?.includes("ROLE_DIRECTOR");

  const fetchReports = useCallback(async (endpoint = "/api/reports") => {
    try {
      setLoading(true);
      const data = await api.get(endpoint);
      console.log("Data from backend:", data);

      if (Array.isArray(data)) {
        setReports(data);
      } else if (data && Array.isArray(data.content)) {
        setReports(data.content);
      } else {
        setReports([]);
        console.warn("API response was not a recognized format.", data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('reports_page.fetch_failed_title'),
        description: error.message || t('reports_page.fetch_failed_desc'),
      });
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
        fetchReports();
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
      toast({ title: t('success'), description: t('reports_page.sanction_update_success') });
      if (searchTerm.trim()) {
          handleSearch();
      } else {
          fetchReports();
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: t('update_failed'),
        description: error.message || t('reports_page.sanction_update_failed'),
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
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle className="font-headline text-2xl">{t('reports_page.title')}</CardTitle>
                <CardDescription>{t('reports_page.description')}</CardDescription>
            </div>
            <Link href="/dashboard/reports/new" passHref>
                <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('reports_page.create_report')}
                </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
            <Select value={searchType} onValueChange={(value) => setSearchType(value as SearchType)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('reports_page.search_by')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">{t('teacher')}</SelectItem>
                <SelectItem value="establishment">{t('establishment')}</SelectItem>
                <SelectItem value="class">{t('class')}</SelectItem>
                <SelectItem value="course">{t('course')}</SelectItem>
                <SelectItem value="description">{t('description')}</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-grow w-full">
              <Input 
                  type="search" 
                  placeholder={t('reports_page.search_placeholder', { type: searchType })}
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={handleSearch} className="flex-grow"><Search className="mr-2 h-4 w-4" />{t('search')}</Button>
              <Button variant="ghost" onClick={handleClearSearch} className="flex-grow"><Eraser className="mr-2 h-4 w-4" />{t('clear')}</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('teacher')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('establishment')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('course')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('date')}</TableHead>
                <TableHead>{t('sanction')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.reportId}>
                    <TableCell>{report.teacherFullName || 'N/A'}</TableCell>
                    <TableCell className="hidden md:table-cell">{report.establishmentName || 'N/A'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{report.courseTitle || 'N/A'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant={getSanctionVariant(report.sanctionType)}>{report.sanctionType || 'NONE'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                          <Eye className="mr-0 sm:mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">{t('reports_page.view_details')}</span>
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
                                <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.reportId, 'COMMENDATION')}>{t('reports_page.set_commendation')}</DropdownMenuItem>
                                <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.reportId, 'NONE')}>{t('reports_page.set_none')}</DropdownMenuItem>
                                <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.reportId, 'WARNING')}>{t('reports_page.set_warning')}</DropdownMenuItem>
                                <DropdownMenuItem disabled={isUpdating} onClick={() => handleSanctionUpdate(report.reportId, 'SUSPENSION')}>{t('reports_page.set_suspension')}</DropdownMenuItem>
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
                    {t('reports_page.no_reports_found')}
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
                <DialogTitle className="font-headline text-2xl">{t('reports_page.details_title', {id: selectedReport.reportId})}</DialogTitle>
                <DialogDescription>
                  {t('reports_page.details_description', {date: new Date(selectedReport.date).toLocaleDateString()})}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('inspector')}</span> <span className="font-medium">{selectedReport.email || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('establishment')}</span> <span className="font-medium">{selectedReport.establishmentName || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('teacher')}</span> <span className="font-medium">{selectedReport.teacherFullName || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('course')}</span> <span className="font-medium">{selectedReport.courseTitle}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('class')}</span> <span className="font-medium">{selectedReport.className}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('date')}</span> <span className="font-medium">{new Date(selectedReport.date).toLocaleDateString()}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('time')}</span> <span className="font-medium">{selectedReport.startTime} - {selectedReport.endTime}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('sanction')}</span> <Badge variant={getSanctionVariant(selectedReport.sanctionType)} className="w-fit">{selectedReport.sanctionType || 'NONE'}</Badge></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('reports_page.sanction_date')}</span> <span className="font-medium">{selectedReport.dateIssued ? new Date(selectedReport.dateIssued).toLocaleDateString() : 'N/A'}</span></div>
                </div>

                <Separator />
                
                <h3 className="font-semibold text-lg">{t('attendance')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('new_report_page.present_students')}</span> <span className="font-medium">{selectedReport.studentPresent ?? 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('new_report_page.absent_students')}</span> <span className="font-medium">{selectedReport.absentStudents ?? 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('reports_page.total_students')}</span> <span className="font-medium">{selectedReport.studentNum ?? 'N/A'}</span></div>
                </div>

                <Separator />
                
                <div>
                    <h3 className="font-semibold text-lg mb-2">{t('reports_page.inspector_observation')}</h3>
                    <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">{selectedReport.observation}</p>
                </div>
                
                {selectedReport.description && (
                  <div>
                      <h3 className="font-semibold text-lg mb-2">{t('reports_page.sanction_description')}</h3>
                      <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                )}
                
                {selectedReport.createdAt && selectedReport.updatedAt && (
                  <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold text-lg mb-2">{t('timestamps')}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                            <div><span className="font-semibold">{t('created_at')}:</span> {new Date(selectedReport.createdAt).toLocaleString()}</div>
                            <div><span className="font-semibold">{t('updated_at')}:</span> {new Date(selectedReport.updatedAt).toLocaleString()}</div>
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


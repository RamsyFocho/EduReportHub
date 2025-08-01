

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "@/lib/api";
import { Report } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { AnimatedPage } from "@/components/shared/AnimatedPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import ReportFilters from "@/components/dashboard/reports/ReportFilters";
import ReportTable from "@/components/dashboard/reports/ReportTable";
import ReportSummaryChart from "@/components/dashboard/reports/ReportSummaryChart";
import { SortConfig, Filters } from "@/types/reports";
import SanctionModal from "@/components/dashboard/reports/SanctionModal";

export default function ReportsPage() {
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [displayReports, setDisplayReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    establishment: "All",
    dateRange: { start: null, end: null },
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "descending",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.get("/api/reports");
      console.log("Response from /api/reports:", data);
      const reports = (Array.isArray(data) ? data : data?.content) || [];
      setAllReports(reports);
    } catch (err: any) {
      setError(err.message || t('reports_page.fetch_failed_desc'));
      toast({
        variant: "destructive",
        title: t('reports_page.fetch_failed_title'),
        description: err.message || t('reports_page.fetch_failed_desc'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const processedReports = useMemo(() => {
    let filtered = [...allReports];

    // Apply search term filter
    if (filters.searchTerm) {
      const lowercasedFilter = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.teacherFullName?.toLowerCase().includes(lowercasedFilter) ||
        report.establishmentName?.toLowerCase().includes(lowercasedFilter) ||
        report.courseTitle?.toLowerCase().includes(lowercasedFilter) ||
        report.observation?.toLowerCase().includes(lowercasedFilter) ||
        report.email?.toLowerCase().includes(lowercasedFilter)
      );
    }

    // Apply establishment filter
    if (filters.establishment && filters.establishment !== "All") {
      filtered = filtered.filter(report => report.establishmentName === filters.establishment);
    }

    // Apply date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
        const startTime = filters.dateRange.start.getTime();
        const endTime = filters.dateRange.end.getTime();
        filtered = filtered.filter(report => {
            const reportTime = new Date(report.date).getTime();
            return reportTime >= startTime && reportTime <= endTime;
        });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [allReports, filters, sortConfig]);

  useEffect(() => {
    setDisplayReports(processedReports);
    setCurrentPage(1); // Reset to first page whenever filters/sorting changes
  }, [processedReports]);

  const requestSort = (key: keyof Report) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return displayReports.slice(startIndex, endIndex);
  }, [displayReports, currentPage, itemsPerPage]);

  const handleOpenSanctionModal = (report: Report) => {
    setSelectedReport(report);
    setIsSanctionModalOpen(true);
  };

  const handleCloseSanctionModal = () => {
    setIsSanctionModalOpen(false);
    setSelectedReport(null);
  };

  const handleSanctionSubmit = async (reportId: number, sanctionData: { sanctionType: string; description: string }) => {
    try {
      await api.put(`/api/reports/sanction/${reportId}`, sanctionData);
      toast({
        title: t('success'),
        description: t('reports_page.sanction_update_success'),
      });
      handleCloseSanctionModal();
      await fetchReports(); // Refetch data to show updated sanction
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: t('reports_page.sanction_update_failed'),
        description: err.message || t('unknown_error'),
      });
    }
  };


  if (isLoading) {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-36" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-72 w-full" />
        </div>
    );
  }

  if (error) {
    return (
       <div className="flex items-center justify-center h-full p-8">
         <Alert variant="destructive" className="max-w-lg">
            <XCircle className="h-4 w-4" />
            <AlertTitle>{t('reports_page.fetch_failed_title')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
         </Alert>
       </div>
    );
  }

  return (
    <AnimatedPage>
      <Card className="w-full">
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
                <TableHead>Created By</TableHead>
                <TableHead>Role</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
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
                    <TableCell>{report.email || 'N/A'}</TableCell>
                    <TableCell>{report.role?.[0]?.name?.replace('ROLE_', '') || 'N/A'}</TableCell>
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
                  <TableCell colSpan={8} className="text-center h-24">
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
        <div className="space-y-6">
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
                </CardHeader>
                <CardContent>
                    <ReportFilters
                        allReports={allReports}
                        filters={filters}
                        onFilterChange={setFilters}
                    />
                </CardContent>
            </Card>

            <ReportSummaryChart displayReports={displayReports} />
            
            <ReportTable 
                reports={paginatedReports}
                requestSort={requestSort}
                sortConfig={sortConfig}
                totalReports={displayReports.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onApplySanction={handleOpenSanctionModal}
            />
        </div>

        {selectedReport && (
            <SanctionModal
                isOpen={isSanctionModalOpen}
                onClose={handleCloseSanctionModal}
                onSubmit={handleSanctionSubmit}
                report={selectedReport}
            />
        )}
    </AnimatedPage>
  );
}


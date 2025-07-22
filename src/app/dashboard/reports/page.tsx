
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
        report.createdBy?.username?.toLowerCase().includes(lowercasedFilter)
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

        if (sortConfig.key === 'createdBy') {
          aValue = a.createdBy?.username || '';
          bValue = b.createdBy?.username || '';
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

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

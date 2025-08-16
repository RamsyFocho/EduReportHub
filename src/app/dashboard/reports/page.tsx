<<<<<<< HEAD

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
=======
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
>>>>>>> test2
import { api } from "@/lib/api";
import { Report } from "@/types"; // Assuming you have a Report type defined
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { AnimatedPage } from "@/components/shared/AnimatedPage";
<<<<<<< HEAD
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
=======
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Eye,
  Eraser,
  ArrowUpDown,
  Trash2,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import Link from "next/link";

// Define the type for better type safety and autocompletion.
// The new fields `deletedAt` and `deletionReason` are now included.
/*
export interface Report {
  reportId: number;
  teacherFullName: string;
  establishmentName: string;
  email: string;
  role: { name: string }[];
  courseTitle: string;
  date: string;
  sanctionType: "NONE" | "WARNING" | "SUSPENSION" | "COMMENDATION" | null;
  deleted: boolean;
  className: string;
  startTime: string;
  endTime: string;
  studentPresent: number;
  studentNum: number;
  observation: string;
  description: string;
  dateIssued: string;
  createdAt: string;
  updatedAt: string;
  // New optional fields for deleted reports
  deletedAt?: string;
  deletionReason?: string;
}
*/

type SearchType =
  | "teacher"
  | "establishment"
  | "class"
  | "course"
  | "description";
type SortDirection = "ascending" | "descending";
type SortKey = keyof Report;

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("teacher");
  const [viewMode, setViewMode] = useState<"active" | "sanctioned" | "deleted">(
    "active"
  );

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>({ key: "date", direction: "descending" });

  // Dialog State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] =
    useState(false);
>>>>>>> test2

  const { toast } = useToast();
  const { t } = useTranslation();

<<<<<<< HEAD
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
=======
  const canUpdateSanction =
    user?.roles?.includes("ROLE_ADMIN") ||
    user?.roles?.includes("ROLE_DIRECTOR");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const endpoint =
      viewMode === "deleted" ? "/api/reports/deleted" : "/api/reports";
    // For sanctioned view, we'll filter client-side to maintain API compatibility
    try {
      const data = await api.get(endpoint);
      console.log("Deleted reports from the API");
      console.log(data);
      const reportsData = Array.isArray(data)
        ? data
        : data && Array.isArray(data.content)
        ? data.content
        : [];
      setReports(reportsData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("reports_page.fetch_failed_title"),
        description: error.message || t("reports_page.fetch_failed_desc"),
>>>>>>> test2
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t, viewMode]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

<<<<<<< HEAD
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
=======
  const sortedAndFilteredReports = useMemo(() => {
    let filtered = [...reports];
    console.log("Deleted reports");
    console.log(selectedReport);
    // Filter by view mode first
    if (viewMode === "active") {
      console.log("---Filtered by Nothing yet---");
      console.log(filtered);
      filtered = filtered.filter(
        (report) =>
          report.sanctionType === "NONE" || report.sanctionType === null
      );
      console.log("---Filtered by None---");
      console.log(filtered);
    } else if (viewMode === "sanctioned") {
      filtered = filtered.filter(
        (report) =>
          report.sanctionType !== "NONE" && report.sanctionType !== null
      );
    }

    // Then apply search filtering
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((report) => {
        const value = (() => {
          switch (searchType) {
            case "teacher":
              return report.teacherFullName;
            case "establishment":
              return report.establishmentName;
            case "class":
              return report.className;
            case "course":
              return report.courseTitle;
            case "description":
              return `${report.observation} ${report.description}`;
            default:
              return "";
          }
        })();
        return value?.toLowerCase().includes(lowerCaseSearchTerm);
      });
    }

    // Sorting logic
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
>>>>>>> test2
        }
        return 0;
      });
    }

    return filtered;
<<<<<<< HEAD
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
=======
  }, [reports, searchTerm, searchType, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSanctionUpdate = async (
    reportId: number,
    sanctionType:
      | "NONE"
      | "WARNING"
      | "SUSPENSION"
      | "COMMENDATION"
      | "OTHER"
      | "OBSERVATION LETTER"
      | "REQUEST EXPLANATION"
  ) => {
    setIsUpdating(true);
    try {
      await api.put(`/api/reports/sanction/${reportId}`, {
        id: reportId,
        sanctionType,
      });
      toast({
        title: t("success"),
        description: t("reports_page.sanction_update_success"),
      });
      fetchReports();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("update_failed"),
        description: error.message || t("reports_page.sanction_update_failed"),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!selectedReport) return;
    setIsUpdating(true);
    try {
      await api.put(`/api/reports/${selectedReport.reportId}/delete`, {
        reason: deleteReason,
      });
      toast({
        title: t("success"),
        description: t("reports_page.delete_success"),
      });
      setDeleteDialogOpen(false);
      setDeleteReason("");
      fetchReports();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("update_failed"),
        description: error.message || t("reports_page.delete_failed"),
      });
    } finally {
      setIsUpdating(false);
    }
  };
>>>>>>> test2

  const handlePermanentDelete = async () => {
    if (!selectedReport) return;
    setIsUpdating(true);
    try {
      await api.delete(`/api/reports/${selectedReport.reportId}`);
      toast({
        title: t("success"),
        description: t("reports_page.permanent_delete_success"),
      });
      setPermanentDeleteDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("update_failed"),
        description: error.message || t("reports_page.permanent_delete_failed"),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getSanctionVariant = (
    sanction: string | null
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (sanction) {
      case "WARNING":
      case "SUSPENSION":
        return "destructive";
      case "COMMENDATION":
        return "default";
      default:
        return "secondary";
    }
  };

  const renderSortArrow = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortConfig.direction === "ascending" ? "▲" : "▼";
  };

  return (
    <AnimatedPage>
<<<<<<< HEAD
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
=======
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="font-headline text-2xl">
                {t("reports_page.title")}
              </CardTitle>
              <CardDescription>
                {viewMode === "active" && t("reports_page.description")}
                {viewMode === "sanctioned" &&
                  t("reports_page.sanctioned_description")}
                {viewMode === "deleted" &&
                  t("reports_page.deleted_description")}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link href="/dashboard/reports/new" passHref>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("reports_page.create_report")}
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "active" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setViewMode("active")}
                >
                  {t("reports_page.view_active")}
                </Button>
                <Button
                  variant={viewMode === "sanctioned" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setViewMode("sanctioned")}
                >
                  <Badge variant="destructive" className="mr-2">
                    !
                  </Badge>
                  {t("reports_page.view_sanctioned")}
                </Button>
                <Button
                  variant={viewMode === "deleted" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setViewMode("deleted")}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  {t("reports_page.view_deleted")}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
            <Select
              value={searchType}
              onValueChange={(value) => setSearchType(value as SearchType)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("reports_page.search_by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">{t("teacher")}</SelectItem>
                <SelectItem value="establishment">
                  {t("establishment")}
                </SelectItem>
                <SelectItem value="class">{t("class")}</SelectItem>
                <SelectItem value="course">{t("course")}</SelectItem>
                <SelectItem value="description">{t("description")}</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("reports_page.search_placeholder_" + searchType)}
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              onClick={handleClearSearch}
              className="w-full sm:w-auto"
            >
              <Eraser className="mr-2 h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => requestSort("teacherFullName")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center">
                    {t("teacher")} {renderSortArrow("teacherFullName")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => requestSort("establishmentName")}
                  className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center">
                    {t("establishment")} {renderSortArrow("establishmentName")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => requestSort("email")}
                  className="hidden lg:table-cell cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center">
                    {t("reports_page.created_by")} {renderSortArrow("email")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => requestSort("date")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center">
                    {t("date")} {renderSortArrow("date")}
                  </div>
                </TableHead>
                {viewMode === "deleted" && (
                  <TableHead
                    onClick={() => requestSort("deletedAt")}
                    className="hidden sm:table-cell cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex items-center">
                      {t("reports_page.deleted_on")}{" "}
                      {renderSortArrow("deletedAt")}
                    </div>
                  </TableHead>
                )}
                <TableHead
                  onClick={() => requestSort("sanctionType")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center">
                    {t("sanction")} {renderSortArrow("sanctionType")}
                  </div>
                </TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    {viewMode === "deleted" && (
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton className="h-6 w-[100px] rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : sortedAndFilteredReports.length > 0 ? (
                sortedAndFilteredReports.map((report) => (
                  <TableRow
                    key={report.reportId}
                    className={viewMode === "deleted" ? "opacity-70" : ""}
                  >
                    <TableCell className="font-medium">
                      {report.teacherFullName || "N/A"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {report.establishmentName || "N/A"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {report.email || "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(report.date).toLocaleDateString()}
                    </TableCell>
                    {viewMode === "deleted" && (
                      <TableCell className="hidden sm:table-cell">
                        {report.deletedAt
                          ? new Date(report.deletedAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={getSanctionVariant(report.sanctionType)}>
                        {report.sanctionType || "NONE"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="mr-0 sm:mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">{t("view")}</span>
                        </Button>
                        {canUpdateSanction && viewMode === "deleted" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setPermanentDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-0 sm:mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t("delete")}
                            </span>
                          </Button>
                        )}
                        {canUpdateSanction && viewMode === "active" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                disabled={isUpdating}
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                disabled={isUpdating}
                                onClick={() =>
                                  handleSanctionUpdate(
                                    report.reportId,
                                    "COMMENDATION"
                                  )
                                }
                              >
                                {t("reports_page.set_commendation")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={isUpdating}
                                onClick={() =>
                                  handleSanctionUpdate(report.reportId, "NONE")
                                }
                              >
                                {t("reports_page.set_none")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={isUpdating}
                                onClick={() =>
                                  handleSanctionUpdate(
                                    report.reportId,
                                    "WARNING"
                                  )
                                }
                              >
                                {t("reports_page.set_warning")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={isUpdating}
                                onClick={() =>
                                  handleSanctionUpdate(
                                    report.reportId,
                                    "SUSPENSION"
                                  )
                                }
                              >
                                {t("reports_page.set_suspension")}
                              </DropdownMenuItem>
                              <Separator />
                              <DropdownMenuItem
                                className="text-destructive"
                                disabled={isUpdating}
                                onClick={() => {
                                  setSelectedReport(report);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                {t("reports_page.delete_report")}
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
                  <TableCell
                    colSpan={viewMode === "deleted" ? 8 : 7}
                    className="text-center h-24"
                  >
                    {t("reports_page.no_reports_found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="sm:max-w-4xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">
                  {`${t("reports_page.details_title")} - ID: ${
                    selectedReport.reportId
                  }`}
                </DialogTitle>
                <DialogDescription>
                  {`${t("reports_page.details_description")} Date: ${new Date(
                    selectedReport.date
                  ).toLocaleDateString()}`}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                {/* Deletion Details Section */}
                {selectedReport.deleted && (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {t("reports_page.deletion_details", "Deletion Details")}
                      </h3>
                      <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm p-4 bg-muted/50 rounded-lg border">
                        <div>
                          <span className="font-semibold text-muted-foreground">
                            {t("reports_page.deleted_at" || "Deletion Date")}:{" "}
                          </span>
                          {selectedReport.deletedAt
                            ? new Date(
                                selectedReport.deletedAt
                              ).toLocaleString()
                            : "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground">
                            {t("reports_page.deleted_by" || "Deletion By")}:{" "}
                          </span>
                          {selectedReport.deletedBy || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground">
                            {t(
                              "reports_page.deletion_reason" ||
                                "Deletion Reason"
                            )}
                            :{" "}
                          </span>
                          {selectedReport.deletionReason || "N/A"}
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Main Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("inspector")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.email || "N/A"} <br />
                      {selectedReport.role[0].name || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("establishment")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.establishmentName || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("teacher")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.teacherFullName || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("course")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.courseTitle}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("class")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.className}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("date")}
                    </span>{" "}
                    <span className="font-medium">
                      {new Date(selectedReport.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("time")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.startTime} - {selectedReport.endTime}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("sanction")}
                    </span>{" "}
                    <Badge
                      variant={getSanctionVariant(selectedReport.sanctionType)}
                      className="w-fit"
                    >
                      {selectedReport.sanctionType || "NONE"}
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("reports_page.sanction_date")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.dateIssued
                        ? new Date(
                            selectedReport.dateIssued
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <Separator />
                <h3 className="font-semibold text-lg">{t("attendance")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("new_report_page.present_students")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.studentPresent ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("new_report_page.absent_students")}
                    </span>
                    <span className="font-medium">
                      {selectedReport.studentNum != null &&
                      selectedReport.studentPresent != null
                        ? selectedReport.studentNum -
                          selectedReport.studentPresent
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {t("reports_page.total_students")}
                    </span>{" "}
                    <span className="font-medium">
                      {selectedReport.studentNum ?? "N/A"}
                    </span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {t("reports_page.inspector_observation")}
                  </h3>
                  <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">
                    {selectedReport.observation}
                  </p>
                </div>
                {selectedReport.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {t("reports_page.sanction_description")}
                    </h3>
                    <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">
                      {selectedReport.description}
                    </p>
                  </div>
                )}
                {selectedReport.createdAt && selectedReport.updatedAt && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {t("timestamps")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-semibold">
                            {t("created_at")}:
                          </span>{" "}
                          {new Date(selectedReport.createdAt).toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">
                            {t("updated_at")}:
                          </span>{" "}
                          {new Date(selectedReport.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Soft Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("reports_page.delete_report_title")}</DialogTitle>
            <DialogDescription>
              {t("reports_page.delete_report_desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder={t("reports_page.delete_reason_placeholder")}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
          </div>
          <Button
            variant="destructive"
            onClick={handleSoftDelete}
            disabled={isUpdating}
          >
            {isUpdating
              ? t("deleting")
              : t("reports_page.delete_report_confirm")}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Permanent Delete Dialog */}
      <Dialog
        open={permanentDeleteDialogOpen}
        onOpenChange={setPermanentDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("reports_page.permanent_delete_title")}
            </DialogTitle>
            <DialogDescription>
              {t("reports_page.permanent_delete_desc")}
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="destructive"
            onClick={handlePermanentDelete}
            disabled={isUpdating}
            className="mt-4"
          >
            {isUpdating
              ? t("deleting")
              : t("reports_page.permanent_delete_confirm")}
          </Button>
        </DialogContent>
      </Dialog>
>>>>>>> test2
    </AnimatedPage>
  );
}

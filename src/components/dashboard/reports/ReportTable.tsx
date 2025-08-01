
"use client";

import { useState } from 'react';
import { Report, SortConfig } from "@/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye, ShieldCheck } from "lucide-react";
import ReportDetailsDialog from "./ReportDetailsDialog";
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

interface ReportTableProps {
  reports: Report[];
  requestSort: (key: keyof Report) => void;
  sortConfig: SortConfig;
  totalReports: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onApplySanction: (report: Report) => void;
}

export default function ReportTable({ reports, requestSort, sortConfig, totalReports, currentPage, itemsPerPage, onPageChange, onApplySanction }: ReportTableProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { t } = useTranslation();
  const { user } = useAuth();
  const canApplySanction = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_DIRECTOR');

  const totalPages = Math.ceil(totalReports / itemsPerPage);

  const getSortIndicator = (key: keyof Report) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return null;
  };

  const getSanctionVariant = (sanction: string | null): "default" | "destructive" | "secondary" | "outline" => {
    switch (sanction) {
        case "WARNING_LETTER":
        case "DISMISSAL":
            return "destructive";
        case "EXPLANATION_REQUEST":
            return "default";
        case "NONE":
        case null:
        default:
            return "secondary";
    }
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('teacherFullName')}>
                  {t('teacher')} <ArrowUpDown className="ml-2 h-4 w-4" /> {getSortIndicator('teacherFullName')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('establishmentName')}>
                  {t('establishment')} <ArrowUpDown className="ml-2 h-4 w-4" /> {getSortIndicator('establishmentName')}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button variant="ghost" onClick={() => requestSort('email')}>
                  {t('inspector')} <ArrowUpDown className="ml-2 h-4 w-4" /> {getSortIndicator('email')}
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button variant="ghost" onClick={() => requestSort('date')}>
                  {t('date')} <ArrowUpDown className="ml-2 h-4 w-4" /> {getSortIndicator('date')}
                </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => requestSort('sanctionType')}>
                  {t('sanction')} <ArrowUpDown className="ml-2 h-4 w-4" /> {getSortIndicator('sanctionType')}
                </Button>
              </TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.reportId}>
                  <TableCell className="font-medium">{report.teacherFullName}</TableCell>
                  <TableCell>{report.establishmentName}</TableCell>
                  <TableCell className="hidden md:table-cell">{report.email || 'N/A'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{format(new Date(report.date), "PPP")}</TableCell>
                  <TableCell>
                    <Badge variant={getSanctionVariant(report.sanctionType)}>
                      {report.sanctionType || 'NONE'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canApplySanction && (
                       <Button variant="ghost" size="icon" onClick={() => onApplySanction(report)}>
                          <ShieldCheck className="h-4 w-4" />
                       </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('reports_page.no_reports_found')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {t('reports_page.pagination_summary', { 
            start: Math.min((currentPage - 1) * itemsPerPage + 1, totalReports), 
            end: Math.min(currentPage * itemsPerPage, totalReports), 
            total: totalReports 
          })}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            {t('next')}
          </Button>
        </div>
      </div>

      <ReportDetailsDialog
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </>
  );
}

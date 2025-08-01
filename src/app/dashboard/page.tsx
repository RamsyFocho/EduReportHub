
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '@/lib/api'; 
import FilterControls from '@/components/dashboard/FilterControls';
import KPI_Card from '@/components/dashboard/KPI_Card';
import ReportsLineChart from '@/components/dashboard/ReportsLineChart';
import EstablishmentPieChart from '@/components/dashboard/EstablishmentPieChart';
import RecentReportsTable from '@/components/dashboard/RecentReportsTable';
import { Report, Establishment } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { AnimatedPage } from '@/components/shared/AnimatedPage';

/**
 * The main component for the data analytics dashboard.
 * It orchestrates data fetching, state management, and the layout of various data visualization components.
 */
export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>('All');
  const { t } = useTranslation();

  // Initial data fetch for establishments and all reports on component mount.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Using Promise.all to fetch data in parallel for efficiency.
        const [reportsResponse, establishmentsData] = await Promise.all([
          api.get('/api/reports'), 
          api.get('/api/establishments'),
        ]);

        // The backend may return a paginated object or a direct array.
        const reportsData = Array.isArray(reportsResponse) 
            ? reportsResponse 
            : reportsResponse.content || [];

        setReports(reportsData);
        setEstablishments(establishmentsData || []);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch initial dashboard data:", err);
        setError(err.message || "Could not load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // --- Memoized Calculations for Performance ---

  const filteredReports = useMemo(() => {
    if (selectedEstablishment === 'All') {
      return reports;
    }
    return reports.filter(report => report.establishmentName === selectedEstablishment);
  }, [reports, selectedEstablishment]);

  // Memoize the total number of reports to avoid recalculating on every render.
  const totalReports = useMemo(() => filteredReports.length, [filteredReports]);

  // Memoize the calculation of unique sanctions.
  const totalUniqueSanctions = useMemo(() => {
    const sanctions = new Set(
      filteredReports
        .map((report: any) => report.sanctionType)
        .filter(sanction => sanction && sanction !== 'NONE') // Filter out null/NONE values
    );
    return sanctions.size;
  }, [filteredReports]);

  const reportsThisMonth = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return filteredReports.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
    }).length;
  }, [filteredReports]);


  // --- Render Logic ---

  if (isLoading) {
    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold font-headline">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-24 w-full" /> )}
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-72 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
            <div>
                 <Skeleton className="h-10 w-48 mb-4" />
                 <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
  }

  if (error) {
    return (
       <div className="flex items-center justify-center h-full p-8">
         <Alert variant="destructive" className="max-w-lg">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
         </Alert>
       </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-2">
        <h1 className="text-3xl font-bold font-headline">Analytics Dashboard</h1>

        {/* Filter controls are placed at the top for easy access. */}
        <FilterControls
          establishments={establishments}
          selectedEstablishment={selectedEstablishment}
          onEstablishmentChange={setSelectedEstablishment}
        />

        {/* A grid for displaying high-level Key Performance Indicators (KPIs). */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPI_Card title="Total Reports" value={totalReports} />
          <KPI_Card title="Active Establishments" value={establishments.length} />
          <KPI_Card title="Unique Sanctions Issued" value={totalUniqueSanctions} />
          <KPI_Card title="Reports this Month" value={reportsThisMonth} />
        </div>

        {/* A grid for the main chart visualizations. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* The line chart takes up more horizontal space on larger screens. */}
          <div className="lg:col-span-2">
            <ReportsLineChart data={filteredReports} />
          </div>
          {/* The pie chart for establishment breakdown. */}
          <div>
            <EstablishmentPieChart data={filteredReports} />
          </div>
        </div>

        {/* A section for displaying a table of the most recent reports. */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 font-headline">Recent Reports</h2>
          <RecentReportsTable data={filteredReports} />
        </div>
      </div>
    </AnimatedPage>
  );
}

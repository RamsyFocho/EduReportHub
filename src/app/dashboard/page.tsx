
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Assumed API service and child components are available for import.
// In a real Next.js app, these would likely be in '@/services/api' and '@/components/dashboard/*'
import { api } from '@/lib/api'; // Assuming a similar structure to the project
import FilterControls from '@/components/dashboard/FilterControls';
import KPI_Card from '@/components/dashboard/KPI_Card';
import ReportsLineChart from '@/components/dashboard/ReportsLineChart';
import EstablishmentPieChart from '@/components/dashboard/EstablishmentPieChart';
import RecentReportsTable from '@/components/dashboard/RecentReportsTable';

/**
 * The main component for the data analytics dashboard.
 * It orchestrates data fetching, state management, and the layout of various data visualization components.
 */
export default function DashboardPage() {
  // State for holding raw data from the API
  const [reports, setReports] = useState([]);
  const [establishments, setEstablishments] = useState([]);

  // State for managing UI and interactivity
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial data fetch for establishments and all reports on component mount.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Using Promise.all to fetch data in parallel for efficiency.
        const [reportsData, establishmentsData] = await Promise.all([
          api.get('/api/reports'), // Assuming this gets all reports
          api.get('/api/establishments'), // Assuming this gets all establishments
        ]);

        // Note: The backend returns a paginated object. We extract the 'content'.
        setReports(reportsData.content || []);
        setEstablishments(establishmentsData || []);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch initial dashboard data:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Effect to re-fetch reports when filters change.
  useEffect(() => {
    // We don't want to run this on the initial render, only on subsequent filter changes.
    // A check to see if filters object is not empty.
    if (Object.keys(filters).length === 0) {
      return;
    }

    const fetchFilteredData = async () => {
      try {
        setIsLoading(true);
        // We assume the backend has a single endpoint for filtering
        // and we pass the entire filters object to it.
        const filteredReports = await api.get(`/api/reports/search/complex`, { params: filters }); // Hypothetical complex search endpoint
        setReports(filteredReports.content || []);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch filtered reports:", err);
        setError("Could not apply filters. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredData();
  }, [filters]); // This effect depends on the 'filters' state.

  // --- Memoized Calculations for Performance ---

  // Memoize the total number of reports to avoid recalculating on every render.
  const totalReports = useMemo(() => reports.length, [reports]);

  // Memoize the calculation of unique sanctions.
  const totalUniqueSanctions = useMemo(() => {
    // Using a Set is an efficient way to count unique values.
    const sanctions = new Set(
      reports
        .map((report: any) => report.sanctionType)
        .filter(sanction => sanction && sanction !== 'NONE') // Filter out null/NONE values
    );
    return sanctions.size;
  }, [reports]);

  // Handler function passed to FilterControls to update the filters state.
  // useCallback ensures this function is not recreated on every render.
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  // --- Render Logic ---

  if (isLoading) {
    // A simple loading indicator. In a real app, this would be a more sophisticated skeleton loader.
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-xl text-muted-foreground">Loading Dashboard...</p>
        </div>
    );
  }

  if (error) {
    // A simple error message display.
    return (
        <div className="flex items-center justify-center h-screen text-destructive">
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold font-headline">Analytics Dashboard</h1>

      {/* Filter controls are placed at the top for easy access. */}
      <FilterControls
        establishments={establishments}
        onFilterChange={handleFilterChange}
      />

      {/* A grid for displaying high-level Key Performance Indicators (KPIs). */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI_Card title="Total Reports" value={totalReports} />
        <KPI_Card title="Active Establishments" value={establishments.length} />
        <KPI_Card title="Unique Sanctions Issued" value={totalUniqueSanctions} />
        <KPI_Card title="Reports this Month" value="--" /> {/* Placeholder */}
      </div>

      {/* A grid for the main chart visualizations. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* The line chart takes up more horizontal space on larger screens. */}
        <div className="lg:col-span-2">
          <ReportsLineChart data={reports} />
        </div>
        {/* The pie chart for establishment breakdown. */}
        <div>
          <EstablishmentPieChart data={reports} />
        </div>
      </div>

      {/* A section for displaying a table of the most recent reports. */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 font-headline">Recent Reports</h2>
        <RecentReportsTable data={reports} />
      </div>
    </div>
  );
}

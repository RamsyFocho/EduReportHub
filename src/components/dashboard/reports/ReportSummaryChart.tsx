
"use client";

import { useMemo } from 'react';
import { Report } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

interface ReportSummaryChartProps {
  displayReports: Report[];
}

export default function ReportSummaryChart({ displayReports }: ReportSummaryChartProps) {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    displayReports.forEach(report => {
      const establishment = report.establishmentName || 'Unknown';
      counts[establishment] = (counts[establishment] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, reports: value }));
  }, [displayReports]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.reports_by_establishment')}</CardTitle>
        <CardDescription>{t('dashboard.filtered_reports_by_establishment_desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="reports" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {t('reports_page.no_data_for_chart')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

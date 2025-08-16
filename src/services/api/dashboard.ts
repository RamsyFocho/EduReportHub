import { api } from '@/lib/api';
import { Report, Establishment } from '@/types';

export const getDashboardData = async (page = 1, limit = 10) => {
  const [reportsResponse, establishments] = await Promise.all([
    api.get('/api/reports', { params: { page, limit } }),
    api.get('/api/establishments'),
  ]);

  const reports = Array.isArray(reportsResponse) ? reportsResponse : reportsResponse.content || [];
  const totalReports = reportsResponse.totalElements || reports.length;

  const totalUniqueSanctions = new Set(
    reports
      .map((report: any) => report.sanctionType)
      .filter((sanction: any) => sanction && sanction !== 'NONE')
  ).size;

  const reportsThisMonth = reports.filter((report: Report) => {
    const reportDate = new Date(report.date);
    const currentDate = new Date();
    return (
      reportDate.getMonth() === currentDate.getMonth() &&
      reportDate.getFullYear() === currentDate.getFullYear()
    );
  }).length;

  return {
    reports,
    establishments,
    totalReports,
    totalUniqueSanctions,
    reportsThisMonth,
    totalPages: reportsResponse.totalPages || 1,
  };
};
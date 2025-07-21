
import { api } from '@/lib/api';

/**
 * Mocks fetching reports by establishment for chart data.
 * In a real application, this would hit a specific analytics endpoint.
 */
export const getReportsByEstablishment = async () => {
  // This is mock data until a real backend endpoint is available.
  return Promise.resolve([
    { establishment: "Springfield High", reports: 186 },
    { establishment: "Shelbyville Elementary", reports: 305 },
    { establishment: "Capital City Middle", reports: 237 },
    { establishment: "North Haverbrook High", reports: 73 },
    { establishment: "Ogdenville Prep", reports: 209 },
  ]);
};

/**
 * Mocks fetching monthly report trends for chart data.
 * In a real application, this would hit a specific analytics endpoint.
 */
export const getMonthlyReportTrends = async () => {
  // This is mock data until a real backend endpoint is available.
  return Promise.resolve([
    { month: "January", reports: 186 },
    { month: "February", reports: 305 },
    { month: "March", reports: 237 },
    { month: "April", reports: 73 },
    { month: "May", reports: 209 },
    { month: "June", reports: 214 },
  ]);
};

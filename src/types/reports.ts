
import type { Report } from './index';

export interface SortConfig {
  key: keyof Report;
  direction: 'ascending' | 'descending';
}

export interface Filters {
  searchTerm: string;
  establishment: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

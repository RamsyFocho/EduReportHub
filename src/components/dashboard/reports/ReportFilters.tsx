
"use client";

import { useMemo, useState } from "react";
import { Report } from "@/types";
import { Filters } from "@/types/reports";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";

interface ReportFiltersProps {
  allReports: Report[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function ReportFilters({ allReports, filters, onFilterChange }: ReportFiltersProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const uniqueEstablishments = useMemo(() => {
    const establishments = new Set(allReports.map(report => report.establishmentName));
    return ["All", ...Array.from(establishments)];
  }, [allReports]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleEstablishmentChange = (value: string) => {
    onFilterChange({ ...filters, establishment: value });
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    if(range?.from && range?.to) {
        onFilterChange({
            ...filters,
            dateRange: { start: range.from, end: range.to }
        });
    }
  };

  const clearFilters = () => {
    setDate(undefined);
    onFilterChange({
      searchTerm: "",
      establishment: "All",
      dateRange: { start: null, end: null },
    });
  };

  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder={t('reports_page.search_placeholder', { type: 'keywords' })}
          value={filters.searchTerm}
          onChange={handleInputChange}
          className="lg:col-span-2"
        />
        <Select value={filters.establishment} onValueChange={handleEstablishmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Establishment" />
          </SelectTrigger>
          <SelectContent>
            {uniqueEstablishments.map(est => (
              <SelectItem key={est} value={est || "Unknown"}>
                {est || "Unknown"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            {t('clear')}
        </Button>
      </div>
    </div>
  );
}



import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Report } from "@/types";
import { Badge } from "../ui/badge";

interface RecentReportsTableProps {
  data: Report[];
}

export default function RecentReportsTable({ data }: RecentReportsTableProps) {
  const recentReports = data.slice(0, 5);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Teacher</TableHead>
          <TableHead>Establishment</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Sanction</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentReports.map((report) => (
          <TableRow key={report.reportId}>
            <TableCell>{report.teacherFullName || 'N/A'}</TableCell>
            <TableCell>{report.establishmentName || 'N/A'}</TableCell>
            <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
            <TableCell><Badge variant={report.sanctionType === "NONE" || !report.sanctionType ? "secondary" : "destructive"}>{report.sanctionType || 'NONE'}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

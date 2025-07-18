"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Report } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AnimatedPage } from "@/components/shared/AnimatedPage";
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
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await api.get("/api/reports");
        setReports(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to fetch reports",
          description: error instanceof Error ? error.message : "Could not load reports.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [toast]);

  const filteredReports = reports.filter(report => 
    report.teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getSanctionVariant = (sanction: string): "default" | "destructive" | "secondary" => {
    switch (sanction) {
        case "WARNING":
            return "destructive";
        case "SUSPENSION":
            return "destructive";
        default:
            return "secondary";
    }
  }

  return (
    <AnimatedPage>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Reports</CardTitle>
                <CardDescription>View, search, and manage all inspection reports.</CardDescription>
            </div>
            <Link href="/dashboard/reports/new" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Report
                </Button>
            </Link>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search" 
                placeholder="Search by teacher, establishment, course..." 
                className="pl-8 sm:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Establishment</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sanction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[70px] rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.teacher.firstName} {report.teacher.lastName}</TableCell>
                    <TableCell>{report.establishment.name}</TableCell>
                    <TableCell>{report.courseTitle}</TableCell>
                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant={getSanctionVariant(report.sanctionType)}>{report.sanctionType}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}

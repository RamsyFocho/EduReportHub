
"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { Report } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SanctionsPage() {
  const [sanctions, setSanctions] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState('');
  const [sanctionType, setSanctionType] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchSanctionsByTeacher = async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const data = await api.get(`/api/reports/sanctions/teacher/${teacherId}`);
      setSanctions(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('sanctions_page.fetch_failed_title'),
        description: error.message || t('sanctions_page.fetch_failed_desc'),
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSanctionsByType = async () => {
    if (!sanctionType) return;
    setLoading(true);
    try {
      const data = await api.get(`/api/reports/sanctions/type/${sanctionType}`);
      setSanctions(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('sanctions_page.fetch_failed_title'),
        description: error.message || t('sanctions_page.fetch_failed_desc'),
      });
    } finally {
      setLoading(false);
    }
  };

  const getSanctionVariant = (sanction: string | null): "default" | "destructive" | "secondary" | "outline" => {
    switch (sanction) {
        case "WARNING":
        case "SUSPENSION":
            return "destructive";
        case "COMMENDATION":
            return "default";
        case "NONE":
        case null:
        default:
            return "secondary";
    }
  };

  return (
    <AnimatedPage>
      <Card>
        <CardHeader>
          <CardTitle>{t('sanctions_page.title')}</CardTitle>
          <CardDescription>{t('sanctions_page.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="teacher">
            <TabsList>
              <TabsTrigger value="teacher">{t('sanctions_page.by_teacher')}</TabsTrigger>
              <TabsTrigger value="type">{t('sanctions_page.by_type')}</TabsTrigger>
            </TabsList>
            <TabsContent value="teacher">
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder={t('sanctions_page.teacher_id_placeholder')}
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                />
                <Button onClick={fetchSanctionsByTeacher}><Search className="mr-2 h-4 w-4" />{t('search')}</Button>
              </div>
            </TabsContent>
            <TabsContent value="type">
              <div className="flex gap-2 mt-4">
                <Select onValueChange={setSanctionType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('sanctions_page.select_type_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WARNING">{t('reports_page.set_warning')}</SelectItem>
                    <SelectItem value="SUSPENSION">{t('reports_page.set_suspension')}</SelectItem>
                    <SelectItem value="COMMENDATION">{t('reports_page.set_commendation')}</SelectItem>
                    <SelectItem value="NONE">{t('reports_page.set_none')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={fetchSanctionsByType}><Search className="mr-2 h-4 w-4" />{t('search')}</Button>
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('teacher')}</TableHead>
                  <TableHead>{t('establishment')}</TableHead>
                  <TableHead>{t('course')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('sanction')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : sanctions.length > 0 ? (
                  sanctions.map((report) => (
                    <TableRow key={report.reportId}>
                      <TableCell>{report.teacherFullName}</TableCell>
                      <TableCell>{report.establishmentName}</TableCell>
                      <TableCell>{report.courseTitle}</TableCell>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getSanctionVariant(report.sanctionType)}>{report.sanctionType || 'NONE'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      {t('sanctions_page.no_sanctions_found')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}

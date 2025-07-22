
"use client";

import { Report } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from 'date-fns';

interface ReportDetailsDialogProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportDetailsDialog({ report, isOpen, onClose }: ReportDetailsDialogProps) {
  const { t } = useTranslation();

  if (!report) return null;
  
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {t('reports_page.details_title', { id: report.reportId })}
          </DialogTitle>
          <DialogDescription>
            {t('reports_page.details_description', { date: format(new Date(report.date), 'PPP') })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('inspector')}</span> <span className="font-medium">{report.email || 'N/A'}</span></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('role')}</span> <span className="font-medium">{report.role?.map(r => r.name).join(', ') || 'N/A'}</span></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('establishment')}</span> <span className="font-medium">{report.establishmentName || 'N/A'}</span></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('teacher')}</span> <span className="font-medium">{report.teacherFullName || 'N/A'}</span></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('course')}</span> <span className="font-medium">{report.courseTitle}</span></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('class')}</span> <span className="font-medium">{report.className}</span></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('date')}</span> <span className="font-medium">{format(new Date(report.date), "PPP")}</span></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('time')}</span> <span className="font-medium">{report.startTime} - {report.endTime}</span></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('sanction')}</span> <Badge variant={getSanctionVariant(report.sanctionType)} className="w-fit">{report.sanctionType || 'NONE'}</Badge></div>
            <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('reports_page.sanction_date')}</span> <span className="font-medium">{report.dateIssued ? format(new Date(report.dateIssued), "PPP") : 'N/A'}</span></div>
          </div>

          <Separator />
          
          <h3 className="font-semibold text-lg">{t('attendance')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('new_report_page.present_students')}</span> <span className="font-medium">{report.studentPresent ?? 'N/A'}</span></div>
              <div className="flex flex-col"><span className="text-sm font-semibold text-muted-foreground">{t('reports_page.total_students')}</span> <span className="font-medium">{report.studentNum ?? 'N/A'}</span></div>
          </div>

          <Separator />
          
          <div>
              <h3 className="font-semibold text-lg mb-2">{t('reports_page.inspector_observation')}</h3>
              <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">{report.observation}</p>
          </div>
          
          {report.description && (
            <div>
                <h3 className="font-semibold text-lg mb-2">{t('reports_page.sanction_description')}</h3>
                <p className="text-sm text-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">{report.description}</p>
            </div>
          )}
          
          {report.createdAt && report.updatedAt && (
            <>
              <Separator />
              <div>
                  <h3 className="font-semibold text-lg mb-2">{t('timestamps')}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                      <div><span className="font-semibold">{t('created_at')}:</span> {format(new Date(report.createdAt), 'PPpp')}</div>
                      <div><span className="font-semibold">{t('updated_at')}:</span> {format(new Date(report.updatedAt), 'PPpp')}</div>
                  </div>
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

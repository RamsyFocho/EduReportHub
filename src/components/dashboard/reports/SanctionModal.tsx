
"use client";

import { useState, useEffect } from "react";
import { Report } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";

interface SanctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportId: number, sanctionData: { sanctionType: string; description: string }) => Promise<void>;
  report: Report | null;
}

const sanctionTypes = [
  "NONE",
  "EXPLANATION_REQUEST",
  "WARNING_LETTER",
  "DISMISSAL"
];

export default function SanctionModal({ isOpen, onClose, onSubmit, report }: SanctionModalProps) {
  const { t } = useTranslation();
  const [sanctionType, setSanctionType] = useState(report?.sanctionType || "NONE");
  const [description, setDescription] = useState(report?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (report) {
      setSanctionType(report.sanctionType || "NONE");
      setDescription(report.description || "");
    }
  }, [report]);

  if (!report) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(report.reportId, { sanctionType, description });
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {t('reports_page.apply_sanction_title', { id: report.reportId })}
          </DialogTitle>
          <DialogDescription>
            {t('reports_page.apply_sanction_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sanction-type">{t('sanction')}</Label>
            <Select value={sanctionType} onValueChange={setSanctionType}>
              <SelectTrigger id="sanction-type">
                <SelectValue placeholder={t('reports_page.select_sanction_type')} />
              </SelectTrigger>
              <SelectContent>
                {sanctionTypes.map(type => (
                  <SelectItem key={type} value={type}>{t(`sanctions.${type}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t('description')} ({t('optional')})</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('reports_page.sanction_desc_placeholder')}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('reports_page.submit_sanction')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

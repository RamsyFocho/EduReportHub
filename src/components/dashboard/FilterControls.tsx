
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Establishment } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { X } from "lucide-react";

interface FilterControlsProps {
    establishments: Establishment[];
    selectedEstablishment: string;
    onEstablishmentChange: (value: string) => void;
}

export default function FilterControls({ establishments, selectedEstablishment, onEstablishmentChange }: FilterControlsProps) {
    const { t } = useTranslation();
    const uniqueEstablishments = Array.from(new Set(establishments.map(e => e.name)));

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card items-center">
            <Select value={selectedEstablishment} onValueChange={onEstablishmentChange}>
                <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Filter by Establishment" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Establishments</SelectItem>
                    {uniqueEstablishments.map((estName) => (
                        <SelectItem key={estName} value={estName}>
                            {estName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => onEstablishmentChange('All')} className="w-full md:w-auto">
                <X className="mr-2 h-4 w-4" />
                {t('clear')}
            </Button>
        </div>
    );
}

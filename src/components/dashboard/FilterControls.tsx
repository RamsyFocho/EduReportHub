
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Establishment } from "@/types";

interface FilterControlsProps {
    establishments: Establishment[];
    onFilterChange: (filters: any) => void;
}

export default function FilterControls({ establishments, onFilterChange }: FilterControlsProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card">
            <Select onValueChange={(value) => onFilterChange({ establishment: value })}>
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by Establishment" />
                </SelectTrigger>
                <SelectContent>
                    {establishments.map((est) => (
                        <SelectItem key={est.id} value={est.name}>
                            {est.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={() => onFilterChange({})}>Clear Filters</Button>
        </div>
    );
}

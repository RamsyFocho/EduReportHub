
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Establishment } from "@/types";

interface FilterControlsProps {
    establishments: Establishment[];
}

export default function FilterControls({ establishments }: FilterControlsProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card">
            <Select>
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
            <Button variant="outline">Clear Filters</Button>
        </div>
    );
}


"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Establishment } from "@/types";

interface FilterControlsProps {
    establishments: Establishment[];
    // onFilterChange is removed for now to simplify and fix the error.
    // A more robust filtering implementation would be needed.
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
            {/* The clear filters button is also simplified as it's not connected to state. */}
            <Button variant="outline">Clear Filters</Button>
        </div>
    );
}

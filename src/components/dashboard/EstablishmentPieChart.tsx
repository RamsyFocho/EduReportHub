
"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface EstablishmentPieChartProps {
    data: any[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function EstablishmentPieChart({ data }: EstablishmentPieChartProps) {
    const establishmentData = data.reduce((acc, report) => {
        const estName = report.establishment?.name || 'Unknown';
        const existingEst = acc.find((item: any) => item.name === estName);
        if (existingEst) {
            existingEst.value++;
        } else {
            acc.push({ name: estName, value: 1 });
        }
        return acc;
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reports by Establishment</CardTitle>
                <CardDescription>Distribution of reports across establishments.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={establishmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {establishmentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

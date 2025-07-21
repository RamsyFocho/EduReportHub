
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ReportsLineChartProps {
    data: any[];
}

export default function ReportsLineChart({ data }: ReportsLineChartProps) {
    // Group reports by month
    const monthlyData = data.reduce((acc, report) => {
        const month = new Date(report.date).toLocaleString('default', { month: 'long' });
        const existingMonth = acc.find((item: any) => item.month === month);
        if (existingMonth) {
            existingMonth.count++;
        } else {
            acc.push({ month, count: 1 });
        }
        return acc;
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Report Trends</CardTitle>
                <CardDescription>Number of reports created per month.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

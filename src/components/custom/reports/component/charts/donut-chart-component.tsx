"use client"

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

interface DonutChartProps {
    data: { name: string; value: number }[]
    colors: string[]
    total: number
}

export const DonutChartComponent = ({ data, colors, total }: DonutChartProps) => (
    <PieChart width={400} height={400}>
        <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
            {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
        </Pie>
        <Tooltip
            formatter={(value: number) => [
                value,
                `${((value / total) * 100).toFixed(1)}% of total`
            ]}
        />
        <Legend />
    </PieChart>
)
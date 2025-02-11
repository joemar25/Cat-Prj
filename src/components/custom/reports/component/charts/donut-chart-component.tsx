'use client'

import { PieChart, Pie, Label, Cell, Tooltip, Legend } from 'recharts'

interface DonutChartProps {
    data: { name: string; value: number }[]
    total: number
}

export const DonutChartComponent = ({ data, total }: DonutChartProps) => {
    // Determine color variables based on the number of data points
    const colorVariables = data.length === 3
        ? ['--chart-1', '--chart-4', '--chart-5']
        : data.length === 2
            ? ['--chart-1', '--chart-4']
            : ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']

    // Fetch HSL values from CSS variables
    const colors = colorVariables.map((variable) => {
        const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
        return value ? `hsl(${value})` : '#ccc'
    })

    return (
        <PieChart width={400} height={400} style={{ pointerEvents: 'none' }}>
            <Tooltip cursor={false} />
            <Legend />
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={100}
                stroke="none"
                isAnimationActive={false}
            >
                {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} style={{ pointerEvents: 'none' }} />
                ))}
                <Label
                    content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                            return (
                                <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {total} {/* Display total in the center */}
                                </text>
                            )
                        }
                    }}
                />
            </Pie>
        </PieChart>
    )
}

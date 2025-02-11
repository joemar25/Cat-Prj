'use client'

import { PieChart, Pie, Label, Cell, Tooltip, Legend } from 'recharts'

interface DonutChartProps {
    data: { name: string; value: number }[]
    total: number
}

export const DonutChartComponent = ({ data, total }: DonutChartProps) => {
    const colorVariables = [
        '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
        '--chart-6', '--chart-7', '--chart-8', '--chart-9', '--chart-10',
    ]

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
                // outerRadius={90}
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

                                </text>
                            )
                        }
                    }}
                />
            </Pie>
        </PieChart>
    )
}

"use client"

import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface AreaChartProps<T> {
    data: T[]
    dataKeyX: keyof T
    dataKeysY: (keyof T)[]
    colors: string[]
}

export const AreaChartComponent = <T,>({ data, dataKeyX, dataKeysY, colors }: AreaChartProps<T>) => (
    <AreaChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKeyX as string} />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeysY.map((key, index) => (
            <Area
                key={key as string}
                type="monotone"
                dataKey={key as string}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
            />
        ))}
    </AreaChart>
)
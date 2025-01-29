"use client"

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface BarChartProps<T> {
    data: T[]
    dataKeyX: keyof T
    dataKeysY: (keyof T)[]
    colors: string[]
}

export const BarChartComponent = <T,>({ data, dataKeyX, dataKeysY, colors }: BarChartProps<T>) => (
    <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKeyX as string} />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeysY.map((key, index) => (
            <Bar key={key as string} dataKey={key as string} fill={colors[index % colors.length]} />
        ))}
    </BarChart>
)
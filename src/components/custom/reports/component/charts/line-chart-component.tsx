"use client"

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface LineChartProps<T> {
    data: T[]
    dataKeyX: keyof T
    dataKeysY: (keyof T)[]
    colors: string[]
}

export const LineChartComponent = <T,>({ data, dataKeyX, dataKeysY, colors }: LineChartProps<T>) => (
    <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKeyX as string} />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeysY.map((key, index) => (
            <Line
                key={key as string}
                type="monotone"
                dataKey={key as string}
                stroke={colors[index % colors.length]}
            />
        ))}
    </LineChart>
)
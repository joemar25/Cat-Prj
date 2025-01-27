"use client"

import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from "recharts"

// Chart props
interface ChartProps<T> {
    data: T[]
    chartType: string
    dataKeyX: keyof T
    dataKeysY: (keyof T)[]
    setChartTypeAction: (type: string) => void
}

// Chart component
export const Chart = <T,>({
    data,
    chartType,
    dataKeyX,
    dataKeysY,
}: ChartProps<T>) => {
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d45087", "#ff7c43"]

    return (
        <div className="w-full">
            <div>
                {chartType === "Bar Chart" && (
                    <BarChart width={600} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={dataKeyX as string} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {dataKeysY.map((key, index) => (
                            <Bar key={key as string} dataKey={key as string} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </BarChart>
                )}
                {chartType === "Line Chart" && (
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
                                stroke={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </LineChart>
                )}
                {chartType === "Pie Chart" && (
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data}
                            dataKey={dataKeysY[0] as string}
                            nameKey={dataKeyX as string}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                )}
                {chartType === "Area Chart" && (
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
                                stroke={COLORS[index % COLORS.length]}
                                fill={COLORS[index % COLORS.length]}
                                fillOpacity={0.3}
                            />
                        ))}
                    </AreaChart>
                )}
            </div>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Label } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useTranslation } from 'react-i18next'

interface FeedbackItem {
    id: string
    feedback: string
    submittedBy: string | null
    createdAt: Date
    updatedAt: Date
    submitterName: string | null
    user: {
        name: string | null
        email: string | null
        image: string | null
    } | null
}

// Define the chartConfig to pass into ChartContainer
const chartConfig = {
    known: {
        label: 'Known Users',
        color: 'hsl(var(--chart-1))',
    },
    anonymous: {
        label: 'Anonymous Users',
        color: 'hsl(var(--chart-2))',
    }
}

const FeedbackUserChart = ({ feedback }: { feedback: FeedbackItem[] }) => {
    const [chartData, setChartData] = useState<{ name: string; value: number; fill: string }[]>([])
    const [knownCount, setKnownCount] = useState(0)
    const [anonymousCount, setAnonymousCount] = useState(0)
    const { t } = useTranslation() // Use the translation hook

    // Function to resolve CSS variables to actual color values
    const resolveCssVariable = (variableName: string) => {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
    }

    useEffect(() => {
        // Correct logic to detect known vs anonymous users
        const knownUsers = feedback.filter(item => item.user && item.user.name !== null).length
        const anonymousUsers = feedback.length - knownUsers

        setKnownCount(knownUsers)
        setAnonymousCount(anonymousUsers)

        // Resolve CSS variables to actual color values
        const knownColor = `hsl(${resolveCssVariable('--chart-3')})`
        const anonymousColor = `hsl(${resolveCssVariable('--chart-2')})`

        setChartData([ 
            { name: t('Known Users'), value: knownUsers, fill: knownColor }, 
            { name: t('Anonymous Users'), value: anonymousUsers, fill: anonymousColor },
        ])
    }, [feedback, t]) // Ensure t is included in dependency

    const totalFeedback = feedback.length

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{t('User Type Distribution')}</CardTitle>
                <CardDescription>{t('Comparison of Known vs. Anonymous Feedback')}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={90}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalFeedback}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {t('Feedbacks')}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex justify-between text-sm">
                <div className="font-medium">{t('Known Users')}: {knownCount}</div>
                <div className="font-medium">{t('Anonymous Users')}: {anonymousCount}</div>
            </CardFooter>
        </Card>
    )
}

export default FeedbackUserChart

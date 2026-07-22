"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive line chart"

const chartData = [
    { date: "2024-04-01", desktop: 222, },
    { date: "2024-04-02", desktop: 97, },
    { date: "2024-04-03", desktop: 167, },
    { date: "2024-04-04", desktop: 242, },
    { date: "2024-04-05", desktop: 373, },
    { date: "2024-04-06", desktop: 301, },
    { date: "2024-04-07", desktop: 245, },
    { date: "2024-04-08", desktop: 409, },
    { date: "2024-04-09", desktop: 59, },
    { date: "2024-04-10", desktop: 261, },
    { date: "2024-04-11", desktop: 327, },
    { date: "2024-04-12", desktop: 292, },
    { date: "2024-04-13", desktop: 342, },
    { date: "2024-04-14", desktop: 137, },
    { date: "2024-04-15", desktop: 120, },
    { date: "2024-04-16", desktop: 138, },
    { date: "2024-04-17", desktop: 446, },
    { date: "2024-04-18", desktop: 364, },
    { date: "2024-04-19", desktop: 243, },
    { date: "2024-04-20", desktop: 89, },
    { date: "2024-04-21", desktop: 137, },
    { date: "2024-04-22", desktop: 224, },
    { date: "2024-04-23", desktop: 138, },
    { date: "2024-04-24", desktop: 387, },

]

const chartConfig = {
    views: {
        label: "Page Views",
    },
    desktop: {
        label: "Desktop",
        color: "var(--primary-light)",
    },
} satisfies ChartConfig

export function ChartLineInteractive() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("desktop")

    const total = React.useMemo(
        () => ({
            desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0)
        }),
        []
    )

    return (
        <Card className="py-4 sm:py-0">
            <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    {["desktop"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                                    {total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Line
                            dataKey={activeChart}
                            type="monotone"
                            stroke={`var(--color-${activeChart})`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

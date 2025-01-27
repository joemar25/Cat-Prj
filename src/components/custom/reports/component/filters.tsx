// src/components/custom/reports/component/filters.tsx
"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersProps {
    yearFrom: number
    yearTo: number
    setYearFromAction: (year: number) => void
    setYearToAction: (year: number) => void
    fetchDataAction: (startYear: number, endYear: number) => Promise<void>
}

export const Filters = ({ yearFrom, yearTo, setYearFromAction, setYearToAction, fetchDataAction }: FiltersProps) => {
    const years = Array.from({ length: 30 }, (_, i) => 2000 + i)

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                    <Label htmlFor="yearFrom">Year From</Label>
                    <Select
                        onValueChange={(value) => setYearFromAction(Number(value))} // Updated prop name
                        defaultValue={yearFrom.toString()}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="yearTo">Year To</Label>
                    <Select
                        onValueChange={(value) => setYearToAction(Number(value))} // Updated prop name
                        defaultValue={yearTo.toString()}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex gap-4">
                <Button onClick={() => fetchDataAction(yearFrom, yearTo)}>Fetch Data</Button>
            </div>
        </div>
    )
}
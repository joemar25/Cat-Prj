// src/components/custom/reports/component/debug-info.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DebugInfoProps {
    dataLength: number
    loading: boolean
    error: string | null
    debugInfo: {
        fetchAttempted: boolean
        lastFetchTime: string | null
    }
}

export const DebugInfo = ({ dataLength, loading, error, debugInfo }: DebugInfoProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="text-sm bg-gray-100 p-2 rounded-md">
                    {JSON.stringify(
                        {
                            dataLength,
                            isLoading: loading,
                            errorMessage: error,
                            debugInfo,
                        },
                        null,
                        2
                    )}
                </pre>
            </CardContent>
        </Card>
    )
}
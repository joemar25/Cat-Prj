// src/components/custom/reports/component/debug-info.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

interface DebugInfoProps {
    dataLength: number;
    loading: boolean;
    error: string | null;
    debugInfo: {
        fetchAttempted: boolean;
        lastFetchTime: string | null;
    };
}

export const DebugInfo = ({ dataLength, loading, error, debugInfo }: DebugInfoProps) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('debugInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="text-sm p-2 rounded-md">
                    {JSON.stringify(
                        {
                            [t('debugInfo.dataLength')]: dataLength,
                            [t('debugInfo.isLoading')]: loading,
                            [t('debugInfo.errorMessage')]: error,
                            debugInfo: {
                                [t('debugInfo.fetchAttempted')]: debugInfo.fetchAttempted,
                                [t('debugInfo.lastFetchTime')]: debugInfo.lastFetchTime,
                            },
                        },
                        null,
                        2
                    )}
                </pre>
            </CardContent>
        </Card>
    );
};
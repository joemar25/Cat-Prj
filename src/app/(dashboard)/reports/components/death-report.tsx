"use client"

import React, { useEffect, useState } from 'react';
import { useReportsStore } from '../store/use-reports-store';

interface DebugInfo {
    fetchAttempted: boolean;
    lastFetchTime: string | null;
}

export const DeathReport = () => {
    const { deathData, loading, error, fetchDeathData } = useReportsStore();
    const [debugInfo, setDebugInfo] = useState<DebugInfo>({
        fetchAttempted: false,
        lastFetchTime: null
    });

    useEffect(() => {
        const fetchData = async () => {
            console.log("Attempting to fetch death data...");
            setDebugInfo({
                fetchAttempted: true,
                lastFetchTime: new Date().toISOString()
            });
            await fetchDeathData(2019, 2025);
        };

        fetchData();
    }, [fetchDeathData]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Death Registrations</h2>
                <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-md">
                        <h3 className="font-semibold mb-2">Debug Info:</h3>
                        <pre className="text-sm">
                            {JSON.stringify({
                                dataLength: deathData?.length || 0,
                                isLoading: loading,
                                errorMessage: error,
                                debugInfo
                            }, null, 2)}
                        </pre>
                    </div>

                    {deathData && deathData.length > 0 ? (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Death Registration Data:</h3>
                            <table className="w-full border-collapse border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Year</th>
                                        <th className="border p-2">Male</th>
                                        <th className="border p-2">Female</th>
                                        <th className="border p-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deathData.map((entry) => (
                                        <tr key={entry.year}>
                                            <td className="border p-2">{entry.year}</td>
                                            <td className="border p-2">{entry.male}</td>
                                            <td className="border p-2">{entry.female}</td>
                                            <td className="border p-2">{entry.male + entry.female}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-4 border rounded bg-yellow-50">
                            No death registration data found for the selected period.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
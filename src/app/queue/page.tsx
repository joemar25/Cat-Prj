// src\app\queue\page.tsx
"use client"

import QueueDisplay from "@/components/kiosk/queue-display"

export default function HomePage() {
    return (
        <div className="min-h-screen p-8" >
            <div className="max-w-7xl mx-auto space-y-8" >
                < div className="flex justify-center" >
                    <QueueDisplay />
                </div>
            </div>
        </div>
    )
}
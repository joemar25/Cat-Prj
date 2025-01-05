"use client"

import dynamic from 'next/dynamic'

// Dynamically import the component to ensure it's loaded correctly
const QueueDisplay = dynamic(() => import("@/components/custom/kiosk/queue-display"), {
    ssr: false // Disable server-side rendering for this component
})

export default function QueuePage() {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-center">
                    <QueueDisplay />
                </div>
            </div>
        </div>
    )
}
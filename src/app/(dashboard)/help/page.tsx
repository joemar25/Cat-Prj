// src/app/(dashboard)/help/page.tsx
import { HelpTutorials } from "@/components/custom/help/help"
import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header"

export default function HelpPage() {
    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard', active: false },
                    { label: 'Help', href: '/help', active: true },
                ]}
            />

            <div className="flex-1 p-4 space-y-4">
                <HelpTutorials />
            </div>
        </>
    )
}

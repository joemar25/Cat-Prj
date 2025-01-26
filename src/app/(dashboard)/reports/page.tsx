import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'

export default async function ProfilePage() {
    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Reports', href: '/reports', active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                Reports
            </div>
        </>
    )
}
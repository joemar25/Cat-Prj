import { Separator } from '@/components/ui/separator'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { TabsReports } from '@/components/custom/reports/tabs-reports'

export default function ProfilePage() {
    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Reports', href: '/reports', active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* <BirthReport />
                <DeathReport />
                <MarriageReport /> */}
                <TabsReports />
                <Separator />
                <div>
                    Note:
                    Create detailed reports on civil registry document requests, processing times, and user activity.
                </div>
            </div>
        </>
    )
}
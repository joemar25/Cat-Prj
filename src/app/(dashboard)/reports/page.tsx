import { BirthReport } from './components/birth-report'
import { DeathReport } from './components/death-report'
import { MarriageReport } from './components/marriage-report'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'

export default function ProfilePage() {
    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Reports', href: '/reports', active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <BirthReport />
                <DeathReport />
                <MarriageReport />
            </div>
        </>
    )
}
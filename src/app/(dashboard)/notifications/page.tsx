import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { NotificationList } from '@/components/custom/notification/notification-list'

export default async function ProfilePage() {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return <div>User not authenticated</div>
    }

    const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { user: true },
    })

    if (!profile) {
        return <div>Profile not found</div>
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Profile', href: '/profile', active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <NotificationList userId={userId} />
            </div>
        </>
    )
}
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'

import Profile from '@/components/custom/profile/profile'

export default async function ProfilePage() {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return <div>User not authenticated</div>
    }

    // Display loading skeleton while fetching the profile
    const profilePromise = prisma.profile.findUnique({
        where: { userId },
        include: { user: true },
    })

    const profile = await profilePromise

    if (!profile || !profile.user) {
        return <div>Profile not found</div>
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard', active: false },
                    { label: 'Profile', href: '/profile', active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Profile userId={userId} profile={profile} isLoading={!profile} />
            </div>
        </>
    )
}

// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { handleSignOut } from "@/hooks/auth-actions"
import { QueueManagement } from "@/components/dashboard/queue-management"
import { SessionProvider } from "next-auth/react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/sign-in")

  return (
    <SessionProvider>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Queue Management</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </div>

        <div className="bg-background">
          <QueueManagement />
        </div>
      </div>
    </SessionProvider>
  )
}
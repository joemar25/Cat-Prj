// src/app/(dashboard)/layout.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/custom/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import TranslationProvider from "@/components/custom/provider/translation-provider"
import { Permission } from "@prisma/client"

type ChildrenProps = {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: ChildrenProps) {
  const session = await auth()
  if (!session) redirect("/")

  const user = {
    roles: session.user.roles.map(roleName => ({
      role: {
        name: roleName || "User",
        permissions: session.user.permissions?.map(permission => ({
          permission: permission as Permission,
        })) || [],
      }
    }))
  };

  return (
    <TranslationProvider>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TranslationProvider>
  )
}
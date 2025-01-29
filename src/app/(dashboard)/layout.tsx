// src/app/(dashboard)/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserRole } from "@prisma/client";
import TranslationProvider from "@/translation/TranslationProvider";


type ChildrenProps = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: ChildrenProps) {
  const session = await auth();
  if (!session) redirect("/");

  const role = session.user.role as UserRole;

  return (
    <TranslationProvider>
      <SidebarProvider>
        <AppSidebar role={role} />
        <SidebarInset>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TranslationProvider>
  );
}
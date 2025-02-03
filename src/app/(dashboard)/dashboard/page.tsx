// app/(dashboard)/dashboard/page.tsx
import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header";
import DashboardContent from "./dashboard-content";


export default async function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-1 flex-col">
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard", active: true },
        ]}
      />
      <DashboardContent />
    </div>
  );
}
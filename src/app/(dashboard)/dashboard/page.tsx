// app/(dashboard)/dashboard/page.tsx
import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header";
import DashboardContent from "./dashboardConent";


export default async function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-1 flex-col">
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard", active: true }, // You can translate this in the client component if needed
        ]}
      />
      <DashboardContent /> {/* Use the client component here */}
    </div>
  );
}
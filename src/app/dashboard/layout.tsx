import SidebarUser from "@/components/layout/SidebarUser"
import TopBar from "@/components/layout/TopBar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | AudenFX",
  description: "Area pengguna AudenFX untuk mencatat dan menganalisis trading.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r hidden md:block">
        <SidebarUser />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

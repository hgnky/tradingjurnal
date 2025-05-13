import Sidebar from "@/components/layout/Sidebar"
import TopBar from "@/components/layout/TopBar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | AudenFX",
  description: "Area pengguna AudenFX untuk mencatat dan menganalisis trading.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  )
}

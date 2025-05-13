import SidebarAdmin from "@/components/layout/SidebarAdmin"
import TopBar from "@/components/layout/TopBar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel | AudenFX",
  description: "Panel kontrol untuk mengelola pengguna, pembayaran, dan konten.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r bg-muted/40 hidden md:block">
        <SidebarAdmin />
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

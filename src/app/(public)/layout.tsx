import { ReactNode } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
        {children}
      </main>
      <Footer />
    </div>
  )
}

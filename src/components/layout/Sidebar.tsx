"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/user-context"

type NavItem = {
  label: string
  href: string
  roles: string[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", roles: ["free", "subscriber", "raider", "admin"] },
  { label: "Journal", href: "/journal", roles: ["free", "subscriber", "raider", "admin"] },
  { label: "Forecast", href: "/forecast", roles: ["subscriber", "raider", "admin"] },
  { label: "Materials (Basic)", href: "/materials/basic", roles: ["subscriber", "raider", "admin"] },
  { label: "Materials (Premium)", href: "/materials/premium", roles: ["raider", "admin"] },
  { label: "Upgrade Plan", href: "/upgrade", roles: ["free"] },
  { label: "Admin Panel", href: "/admin/dashboard", roles: ["admin"] },
]

export default function Sidebar() {
  const { role, loading } = useUser()
  const pathname = usePathname()

  if (loading || !role) return null

  return (
    <aside className="w-64 min-h-screen border-r bg-white dark:bg-zinc-900 flex flex-col px-4 py-6">
      <div className="text-2xl font-bold mb-8 text-primary">AudenFX</div>

      <nav className="space-y-1">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
      </nav>
    </aside>
  )
}

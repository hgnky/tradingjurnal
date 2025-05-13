'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import {
  LayoutDashboard,
  Users,
  FileCheck,
  UploadCloud,
  Bot,
  Settings,
  LogOut,
  ShieldCheck,
  Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function SidebarAdmin() {
  const { role, isLoading } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && role !== 'admin') {
      router.push('/dashboard')
    }
  }, [role, isLoading])

  if (isLoading || role !== 'admin') return null

  const pathnameIs = (href: string) => pathname === href

  const navAdmin = [
    {
      href: '/admin/dashboard',
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
    },
  ]

  const navManage = [
    {
      href: '/admin/users',
      label: 'Manajemen User',
      icon: Users,
    },
    {
      href: '/admin/payments',
      label: 'Verifikasi Pembayaran',
      icon: FileCheck,
    },
    {
      href: '/admin/materials',
      label: 'Upload Materi',
      icon: UploadCloud,
    },
    {
      href: '/admin/forecasts',
      label: 'Forecast AI',
      icon: Bot,
    },
    {
      href: '/admin/indicator',
      label: 'Manage Indicator Requests',
      icon: Award,
    },
  ]

  const navSystem = [
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="w-64 h-screen border-r bg-background p-4">
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-6">
          <div className="text-lg font-bold px-2">AudenFX Admin</div>

          {/* Admin Panel */}
          <div>
            <p className="text-xs text-muted-foreground px-3 mb-1">Admin Panel</p>
            <nav className="space-y-1">
              {navAdmin.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                    pathnameIs(href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Manajemen */}
          <div>
            <p className="text-xs text-muted-foreground px-3 mb-1">Manajemen</p>
            <nav className="space-y-1">
              {navManage.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                    pathnameIs(href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Sistem */}
          <div>
            <p className="text-xs text-muted-foreground px-3 mb-1">Sistem</p>
            <nav className="space-y-1">
              {navSystem.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                    pathnameIs(href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-6 rounded-md bg-muted/40 p-3 text-xs flex items-center gap-2 text-muted-foreground">
          <ShieldCheck size={14} className="text-yellow-500" />
          Admin access aktif
        </div>
      </div>
    </aside>
  )
}

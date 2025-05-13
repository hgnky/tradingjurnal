'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  PenTool,
  Zap,
  BookOpen,
  Rocket,
  ArrowUpRight,
  Clock,
  BadgeCheck,
  User,
  ShieldCheck,
  Settings,
  LogOut,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function SidebarUser() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, role, isLoading } = useUser()
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [label, setLabel] = useState<string>('')

  useEffect(() => {
    if (!user || !role) return

    const fetchTimeInfo = async () => {
      if (role === 'free') {
        const { data } = await supabase
          .from('users')
          .select('trial_ends_at')
          .eq('id', user.id)
          .single()

        if (data?.trial_ends_at) {
          const end = dayjs(data.trial_ends_at)
          const left = end.diff(dayjs(), 'day')
          setDaysLeft(left)
          setLabel('Trial')
        }
      } else if (role === 'subscriber') {
        const { data } = await supabase
          .from('subscriptions')
          .select('end_date')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (data?.end_date) {
          const end = dayjs(data.end_date)
          const left = end.diff(dayjs(), 'day')
          setDaysLeft(left)
          setLabel('Subscription')
        }
      } else if (role === 'raider') {
        setLabel('Lifetime')
      }
    }

    fetchTimeInfo()
  }, [user, role])

  if (isLoading) return null

  const pathnameIs = (href: string) => pathname === href

  const navMain = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      href: '/dashboard/journal',
      label: 'Journal',
      icon: PenTool,
      allowed: ['subscriber', 'raider', 'admin'],
    },
    {
      href: '/dashboard/forecast',
      label: 'AI Forecast',
      icon: Zap,
      allowed: ['subscriber', 'raider', 'admin'],
    },
    {
      href: '/dashboard/indicator',
      label: 'Indicator',
      icon: ArrowUpRight,
      allowed: ['subscriber', 'raider', 'admin'],
    },
  ]

  const navMaterials = [
    { href: '/dashboard/materials', label: 'Materials', icon: BookOpen, allowed: ['subscriber', 'raider', 'admin'] },
    {
      href: '/dashboard/materials/premium',
      label: 'Premium Materials',
      icon: Rocket,
      allowed: ['raider', 'admin'],
    },
  ]

  const navAccount = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const roleLabel = {
    free: 'Free User',
    subscriber: 'Subscriber',
    raider: 'Raider',
    admin: 'Admin',
  }[role || ''] || 'User'

  const roleIcon = {
    free: <User size={16} className="text-gray-500" />,
    subscriber: <ShieldCheck size={16} className="text-blue-500" />,
    raider: <BadgeCheck size={16} className="text-green-500" />,
    admin: <ShieldCheck size={16} className="text-yellow-500" />,
  }[role || '']

  return (
    <aside className="w-64 h-screen border-r bg-background p-4">
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-6">
          <div className="text-lg font-bold px-2">AudenFX</div>

          {/* Main */}
          <div>
            <p className="text-xs text-muted-foreground px-3 mb-1">Main</p>
            <nav className="space-y-1">
              {navMain.map(({ href, label, icon: Icon, allowed }) => {
                const canView = !allowed || allowed.includes(role || '')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                      pathnameIs(href)
                        ? 'bg-muted text-foreground'
                        : canView
                        ? 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        : 'text-gray-400 cursor-not-allowed'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <Separator />

          {/* Materials */}
          <div>
            <p className="text-xs text-muted-foreground px-3 mb-1">Materials</p>
            <nav className="space-y-1">
              {navMaterials.map(({ href, label, icon: Icon, allowed }) => {
                const canView = !allowed || allowed.includes(role || '')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                      pathnameIs(href)
                        ? 'bg-muted text-foreground'
                        : canView
                        ? 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        : 'text-gray-400 cursor-not-allowed'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <Separator />

          {/* Account */}
          <div>
            <p className="text-xs text-muted-foreground px-3 mb-1">Account</p>
            <nav className="space-y-1">
              {navAccount.map(({ href, label, icon: Icon }) => (
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

          {role === 'free' && (
            <div className="pt-4">
              <Button asChild className="w-full" variant="default">
                <Link href="/dashboard/upgrade">🚀 Upgrade Sekarang</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mt-6 rounded-md bg-muted/40 p-3 text-xs flex flex-col gap-2 text-muted-foreground">
          <div className="flex items-center gap-2 font-medium">
            {roleIcon}
            {roleLabel}
          </div>

          {label === 'Lifetime' ? (
            <div className="flex items-center gap-2">
              <BadgeCheck size={14} className="text-green-500" />
              Lifetime access aktif
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {label}: {daysLeft ?? '-'} hari
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  allowed?: string[]
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/journal', label: 'Journal', icon: <PenTool size={18} />, allowed: ['subscriber', 'raider', 'admin'] },
  { href: '/dashboard/forecast', label: 'AI Forecast', icon: <Zap size={18} />, allowed: ['subscriber', 'raider', 'admin'] },
  { href: '/dashboard/materials/basic', label: 'Basic Materials', icon: <BookOpen size={18} />, allowed: ['subscriber', 'raider', 'admin'] },
  { href: '/dashboard/materials/premium', label: 'Premium Materials', icon: <Rocket size={18} />, allowed: ['raider', 'admin'] },
  { href: '/dashboard/upgrade', label: 'Upgrade Plan', icon: <ArrowUpRight size={18} />, allowed: ['free'] },
]

export default function SidebarUser() {
  const pathname = usePathname()
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

  return (
    <aside className="w-64 h-screen p-4">
      <div className="h-full flex flex-col justify-between rounded-xl border border-white/10 bg-background/70 backdrop-blur-md shadow-md p-4">
        <div>
          <div className="mb-6 px-2 text-lg font-bold tracking-tight">
            AudenFX
          </div>

          <nav className="space-y-1">
            {navItems.map(({ href, label, icon, allowed }) => {
              const isActive = pathname === href
              const canView = !allowed || allowed.includes(role || '')

              if (!canView) return null

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-6 rounded-md bg-muted/40 p-3 text-xs flex items-center gap-2 text-muted-foreground">
          {label === 'Lifetime' ? (
            <>
              <BadgeCheck size={16} className="text-green-500" />
              Lifetime access
            </>
          ) : (
            <>
              <Clock size={16} />
              {label}: {daysLeft ?? '-'} day(s) left
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/user-context'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BadgeCheck, Clock, ShieldCheck, User } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

dayjs.locale('id') // gunakan locale Indonesia

export default function SettingsPage() {
  const { user, role, isLoading } = useUser()
  const [expiredAt, setExpiredAt] = useState<string | null>(null)
  const [label, setLabel] = useState<string>('')

  useEffect(() => {
    if (!user || !role) return

    const fetchTimeInfo = async () => {
      try {
        if (role === 'free') {
          const { data } = await supabase
            .from('users')
            .select('trial_ends_at')
            .eq('id', user.id)
            .single()

          if (data?.trial_ends_at) {
            setExpiredAt(dayjs(data.trial_ends_at).format('D MMMM YYYY'))
            setLabel('Trial')
          }
        } else if (role === 'subscriber') {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('end_date')
            .eq('user_id', user.id)
            .eq('status', 'active')

          if (error) throw error

          if (data && data.length > 0) {
            const latest = data
              .filter((sub) => !!sub.end_date)
              .sort(
                (a, b) =>
                  new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
              )[0]

            setExpiredAt(dayjs(latest.end_date).format('D MMMM YYYY'))
            setLabel('Subscription')
          }
        } else if (role === 'raider') {
          setLabel('Lifetime')
        }
      } catch (err) {
        console.error('[Settings Expired Date Error]', err)
      }
    }

    fetchTimeInfo()
  }, [user, role])

  const roleLabel = {
    free: 'Free User',
    subscriber: 'Subscriber',
    raider: 'Raider',
    admin: 'Admin',
  }[role || '']

  const roleIcon = {
    free: <User size={16} className="text-gray-500" />,
    subscriber: <ShieldCheck size={16} className="text-blue-500" />,
    raider: <BadgeCheck size={16} className="text-green-500" />,
    admin: <ShieldCheck size={16} className="text-yellow-500" />,
  }[role || '']

  if (isLoading || !user) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Nama:</strong> {user.name || '-'}</div>
          <div className="flex items-center gap-2">
            <strong>Role:</strong> {roleIcon} {roleLabel}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Akses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {label === 'Lifetime' ? (
            <div className="flex items-center gap-2 text-green-600">
              <BadgeCheck size={16} />
              Akses Lifetime Aktif
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                {label} aktif hingga: <span className="font-medium">{expiredAt ?? '-'}</span>
              </div>

              {(role === 'free' || role === 'subscriber') && expiredAt && (
                <div className="pt-2">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/upgrade">🚀 Upgrade Sekarang</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Perpanjang sebelum tanggal berakhir agar tetap bisa mengakses fitur.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

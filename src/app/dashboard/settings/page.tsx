'use client'

import { useUser } from '@/context/user-context'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, role, isLoading } = useUser()
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [label, setLabel] = useState<string>('')

  const [name, setName] = useState('')
  const [savingName, setSavingName] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name)
    }
  }, [user])

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user || !role) return

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
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('end_date')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (sub?.end_date) {
          const end = dayjs(sub.end_date)
          const left = end.diff(dayjs(), 'day')
          setDaysLeft(left)
          setLabel('Subscription')
        }

        const { data: inv } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setInvoices(inv || [])
      } else if (role === 'raider') {
        setLabel('Lifetime')
      }
    }

    fetchStatus()
  }, [user, role])

  const handleUpdateName = async () => {
    if (!name || !user) return
    setSavingName(true)
    const { error } = await supabase.auth.updateUser({
      data: { name }
    })
    setSavingName(false)
    if (!error) toast.success('Nama berhasil diperbarui!')
  }

  const handleChangePassword = async () => {
    if (!newPassword) return
    setChangingPassword(true)
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    setChangingPassword(false)
    if (!error) {
      toast.success('Password berhasil diubah!')
      setNewPassword('')
    }
  }

  if (isLoading || !user) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">⚙️ Pengaturan Akun</h1>

      {/* Info Akun */}
      <Card>
        <CardHeader><CardTitle>Informasi Akun</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-muted-foreground mb-1">Role</p>
            <Badge variant="outline" className="capitalize text-xs">{role}</Badge>
          </div>

          {label === 'Lifetime' ? (
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <Badge className="bg-green-600 text-white">Lifetime</Badge>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground mb-1">Sisa Waktu</p>
              <p className="font-medium">
                {daysLeft ?? '-'} hari ({label})
              </p>
            </div>
          )}

          {/* ⚠️ Notifikasi perpanjangan */}
          {label === 'Subscription' && daysLeft !== null && daysLeft <= 5 && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 text-sm p-3 rounded-md">
              ⚠️ Langganan kamu akan berakhir dalam <strong>{daysLeft}</strong> hari.
              <Link href="/dashboard/upgrade" className="underline ml-1">Perpanjang Sekarang</Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Profil */}
      <Card>
        <CardHeader><CardTitle>✏️ Edit Profil</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm mb-1 block">Nama</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={handleUpdateName} disabled={savingName}>
            {savingName ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </CardContent>
      </Card>

      {/* Ganti Password */}
      <Card>
        <CardHeader><CardTitle>🔑 Ganti Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm mb-1 block">Password Baru</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword}
            variant="secondary"
          >
            {changingPassword ? 'Mengganti...' : 'Ganti Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Invoice History */}
      {invoices.length > 0 && (
        <Card>
          <CardHeader><CardTitle>🧾 Histori Pembayaran</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="border rounded-md p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{inv.description || 'Langganan AudenFX'}</p>
                  <p className="text-xs text-muted-foreground">
                    {dayjs(inv.created_at).format('DD MMM YYYY')}
                  </p>
                </div>
                <div className="text-sm font-semibold">
                  {inv.amount ? `Rp${inv.amount.toLocaleString()}` : '-'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

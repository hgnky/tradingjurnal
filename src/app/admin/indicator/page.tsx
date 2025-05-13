'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/user-context'
import { supabase } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

type Request = {
  id: string
  user_id: string
  tradingview_username: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  notes?: string
  ib_code?: string
  user: {
    email: string
    name: string
    role: {
      name: string
    }
  }
}

export default function AdminIndicatorPage() {
  const { role, loading } = useUser()
  const [requests, setRequests] = useState<Request[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({}) // To store notes for each request

  useEffect(() => {
    if (!loading && role !== 'admin') window.location.href = '/unauthorized'
  }, [role, loading])

  useEffect(() => {
    const fetchRequests = async () => {
      const { data } = await supabase
        .from('indicator_requests')
        .select('*, user:users(email, name, role:roles(name))')
        .order('created_at', { ascending: false })

      setRequests(data || [])
    }

    fetchRequests()
  }, [])

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    const note = notes[id] || ''
    const { error } = await supabase
      .from('indicator_requests')
      .update({ status: action, notes: note })
      .eq('id', id)

    if (error) return toast.error('Gagal update status')

    // Approve: Update subscription if IB Code is used
    if (action === 'approved') {
      const { data: userData, error: userError } = await supabase
        .from('indicator_requests')
        .select('user_id, ib_code')
        .eq('id', id)
        .single()

      if (userData?.user_id && userData.ib_code) {
        // Add 30 days for free/subscriber users using IB Code
        const { data: userSubscription } = await supabase
          .from('subscriptions')
          .select('end_date')
          .eq('user_id', userData.user_id)
          .single()

        if (userSubscription?.end_date) {
          const newEndDate = new Date(userSubscription.end_date)
          newEndDate.setDate(newEndDate.getDate() + 30) // Add 30 days

          await supabase
            .from('subscriptions')
            .update({ end_date: newEndDate })
            .eq('user_id', userData.user_id)

          toast.success('30 hari gratis berhasil ditambahkan ke subscription kamu!')
        }
      }
    }

    setRequests(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: action, notes: note } : r
      )
    )

    toast.success(`Permintaan ${action === 'approved' ? 'disetujui' : 'ditolak'}`)
  }

  if (loading || role !== 'admin') return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📋 Permintaan Akses Indicator</h1>

      {requests.map((r) => (
        <Card key={r.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>@{r.tradingview_username}</span>
              <span className={`capitalize text-sm ${r.status === 'approved' ? 'text-green-600' : r.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                {r.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {r.user?.email} — {r.user?.name}
            </div>
            <div className="text-xs text-muted-foreground">{r.user?.role?.name}</div>
            <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</div>

            {r.status === 'pending' && (
              <div className="space-y-2 mt-2">
                <Input
                  value={notes[r.id] || ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  placeholder="Catatan opsional"
                />
                <div className="flex gap-2">
                  <Button variant="success" onClick={() => handleAction(r.id, 'approved')}>Approve</Button>
                  <Button variant="destructive" onClick={() => handleAction(r.id, 'rejected')}>Reject</Button>
                </div>
              </div>
            )}

            {r.notes && r.status !== 'pending' && (
              <div className="text-sm text-muted-foreground italic mt-2">📝 {r.notes}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

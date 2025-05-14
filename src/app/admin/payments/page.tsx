'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/context/user-context'
import { useRouter } from 'next/navigation'

type ManualPayment = {
  id: string
  user_id: string
  plan: string
  amount: number
  bank_name: string
  transfer_date: string
  proof_url: string
  created_at: string
}

export default function AdminPaymentsPage() {
  const { role, loading } = useUser()
  const router = useRouter()

  const [payments, setPayments] = useState<ManualPayment[]>([])
  const [fetching, setFetching] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && role !== 'admin') router.push('/unauthorized')
  }, [role, loading])

  const fetchPayments = async () => {
    setFetching(true)
    const { data, error } = await supabase
      .from('manual_payments')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (!error && data) setPayments(data)
    setFetching(false)
  }

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id)
    const { error } = await supabase
      .from('manual_payments')
      .update({ status })
      .eq('id', id)

    if (!error) {
      fetchPayments()
    }

    setActionLoading(null)
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  if (loading || role !== 'admin' || fetching) {
    return <div className="p-6">Memuat pembayaran...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Verifikasi Manual Payment</h1>

      {payments.length === 0 ? (
        <p className="text-muted-foreground">Tidak ada pembayaran menunggu verifikasi.</p>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <CardTitle>{payment.plan.toUpperCase()} – Rp {payment.amount.toLocaleString('id-ID')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>User ID:</strong> {payment.user_id}</p>
                <p><strong>Bank:</strong> {payment.bank_name}</p>
                <p><strong>Tanggal Transfer:</strong> {payment.transfer_date}</p>
                <p>
                  <strong>Bukti:</strong>{' '}
                  <a
                    href={payment.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Lihat Gambar
                  </a>
                </p>
                <div className="flex gap-2 pt-3">
                  <Button
                    onClick={() => handleAction(payment.id, 'approved')}
                    disabled={actionLoading === payment.id}
                    variant="success"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleAction(payment.id, 'rejected')}
                    disabled={actionLoading === payment.id}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

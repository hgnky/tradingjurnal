'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function RejectManualPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleReject = async () => {
    if (!id) return

    setLoading(true)
    setError('')
    setSuccess(false)

    const { error } = await supabase
      .from('manual_payments')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/payments')
      }, 1500)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-red-600">Reject Manual Payment</h1>
      <p className="text-sm text-muted-foreground">
        Payment ID: <span className="font-mono">{id || 'invalid'}</span>
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">✅ Berhasil ditolak</p>}

      <Button
        onClick={handleReject}
        disabled={loading || !id}
        variant="destructive"
        className="w-full"
      >
        {loading ? 'Memproses...' : 'Tolak Pembayaran Ini'}
      </Button>
    </div>
  )
}

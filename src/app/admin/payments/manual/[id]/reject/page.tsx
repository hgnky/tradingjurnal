'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type PageProps = {
  params: {
    id: string
  }
}

export default function RejectManualPaymentPage({ params }: PageProps) {
  const router = useRouter()
  const paymentId = params.id

  useEffect(() => {
    console.log('🔍 Reject manual payment ID:', paymentId)

    // TODO: Kirim request ke API Supabase atau internal endpoint untuk reject
    // Contoh (dummy):
    // await supabase.from('manual_payments').update({ status: 'rejected' }).eq('id', paymentId)
  }, [paymentId])

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Reject Manual Payment</h1>
      <p className="text-sm text-muted-foreground">
        Payment ID: <span className="font-mono text-black">{paymentId}</span>
      </p>
      <p className="text-sm">
        Kamu bisa mengirim logika penolakan ke Supabase, update status ke <code>'rejected'</code>, dan redirect admin setelah selesai.
      </p>
    </div>
  )
}

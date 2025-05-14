'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RejectClient({ id }: { id: string }) {
  const router = useRouter()

  useEffect(() => {
    console.log('🔍 Reject manual payment ID:', id)

    // TODO: panggil API reject
    // await supabase.from('manual_payments').update({ status: 'rejected' }).eq('id', id)
  }, [id])

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Reject Manual Payment</h1>
      <p className="text-sm text-muted-foreground">
        Payment ID: <span className="font-mono">{id}</span>
      </p>
      <p className="text-sm">
        Kamu bisa mengirim logika penolakan ke Supabase, update status ke <code>'rejected'</code>, dan redirect admin setelah selesai.
      </p>
    </div>
  )
}

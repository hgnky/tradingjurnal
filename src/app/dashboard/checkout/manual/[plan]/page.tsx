'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export default function ManualCheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const plan = String(params.plan)

  const [amount, setAmount] = useState(plan === 'raider' ? 3500000 : 1500000)
  const [bankName, setBankName] = useState('BCA')
  const [transferDate, setTransferDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [success, setSuccess] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    const filePath = `proofs/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('proofs')
      .upload(filePath, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('proofs')
      .getPublicUrl(filePath)

    setProofUrl(urlData.publicUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSuccess(false)

    try {
      if (!proofUrl) await handleUpload()

      const { error: insertError } = await supabase.from('manual_payments').insert({
        plan,
        amount,
        bank_name: bankName,
        transfer_date: transferDate,
        proof_url: proofUrl,
        status: 'pending',
      })

      if (insertError) throw insertError

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold capitalize">
        Manual Transfer – {plan} Plan
      </h1>

      {success ? (
        <div className="space-y-4 border border-green-200 rounded-md p-4 bg-green-50">
          <p className="text-green-700 font-medium">✅ Bukti transfer berhasil dikirim!</p>
          <p className="text-sm text-muted-foreground">
            Admin akan memverifikasi pembayaran kamu dalam waktu 1×24 jam. Status saat ini: <strong>pending</strong>.
          </p>
          <Button onClick={() => router.push('/dashboard')} className="w-full mt-4">
            Kembali ke Dashboard
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Bank Name</Label>
            <Input value={bankName} onChange={(e) => setBankName(e.target.value)} required />
          </div>
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label>Transfer Date</Label>
            <Input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Upload Proof</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Proof'}
          </Button>
        </form>
      )}
    </div>
  )
}

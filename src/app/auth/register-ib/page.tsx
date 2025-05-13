"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-browser"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RegisterIBPage() {
  const [ibName, setIbName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!ibName) return toast.error("Masukkan nama IB kamu")

    setSubmitting(true)

    const { error } = await supabase.from("ib_codes").insert({
      user_id: (await supabase.auth.getSession()).data.session?.user.id,
      ib_name: ibName,
    })

    if (error) {
      toast.error("Gagal mendaftar sebagai IB")
    } else {
      toast.success("IB Code berhasil dibuat. Gunakan untuk klaim indikator gratis!")
      router.push("/indicator") // Arahkan user kembali ke halaman klaim indikator
    }

    setSubmitting(false)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Registrasi IB (Introducing Broker)</h1>

      <Card>
        <CardHeader>
          <CardTitle>Form Registrasi IB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={ibName}
            onChange={(e) => setIbName(e.target.value)}
            placeholder="Masukkan nama IB kamu"
            disabled={submitting}
          />
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Mengirim..." : "Daftar sebagai IB"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

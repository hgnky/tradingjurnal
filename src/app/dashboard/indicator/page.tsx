"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-browser"
import { useUser } from "@/context/user-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

type Request = {
  id: string
  tradingview_username: string
  status: string
  created_at: string
  notes?: string
  ib_code?: string
}

export default function IndicatorPage() {
  const { user, role, loading } = useUser()
  const [username, setUsername] = useState("")
  const [ibCode, setIbCode] = useState("")
  const [requests, setRequests] = useState<Request[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [totalClaims, setTotalClaims] = useState(0)
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      // Get total claims
      const { data } = await supabase
        .from("indicator_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setRequests(data || [])

      const totalFreeClaims = data?.length || 0
      setTotalClaims(totalFreeClaims)

      if (role === "free") {
        // Check if user is eligible for claim based on registration date (15 days rule)
        const { data: userData } = await supabase
          .from("users")
          .select("trial_ends_at")
          .eq("id", user.id)
          .single()

        if (userData?.trial_ends_at) {
          const trialEndDate = new Date(userData.trial_ends_at)
          const diffInDays = Math.floor((new Date().getTime() - trialEndDate.getTime()) / (1000 * 3600 * 24))
          setDaysLeft(diffInDays)

          // Disable claim button if trial has ended or claim has been made already
          setDisabled(diffInDays < 0 || data?.length >= 1)
        }
      }

      // Subscriber: Limit 1 claim every 24 hours
      if (role === "subscriber") {
        const latest = data?.[0]
        if (latest && new Date(latest.created_at) > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
          setDisabled(true) // 1 request per 24h for subscribers
        }
      }
      
      setDisabled(totalFreeClaims >= 15)  // Max 15 claims for free users
    }

    fetch()
  }, [user, role])

  const handleSubmit = async () => {
    if (!username) return toast.error("Masukkan username TradingView")

    setSubmitting(true)

    const { error } = await supabase.from("indicator_requests").insert({
      user_id: user?.id,
      tradingview_username: username,
      ib_code: ibCode || null,  // Simpan IB Code jika ada
      status: "pending"
    })

    if (error) {
      toast.error("Gagal mengirim permintaan")
    } else {
      toast.success("Permintaan dikirim!")
      setUsername("")
      setIbCode("")
      setRequests((prev) => [
        {
          id: Date.now().toString(),
          tradingview_username: username,
          status: "pending",
          created_at: new Date().toISOString(),
          ib_code: ibCode
        },
        ...prev
      ])
      setDisabled(true)  // Disable the claim button after successful submission
    }

    setSubmitting(false)
  }

  if (loading) return <div className="p-6">Memuat...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📈 Klaim Akses Indicator</h1>

      {role === "free" && daysLeft !== null && daysLeft < 0 && (
        <p className="text-sm text-red-500">
          Masa trial kamu telah habis. Klaim indikator tidak tersedia lagi.
        </p>
      )}

      {role === "free" && daysLeft !== null && daysLeft >= 0 && (
        <p className="text-sm text-red-500">
          Kamu bisa klaim 1x indikator selama masa trial yang tersisa ({daysLeft} hari).
        </p>
      )}

      {role === "subscriber" && (
        <p className="text-sm text-red-500">
          Klaim indikator hanya bisa dilakukan sekali setiap 24 jam.
        </p>
      )}

      {role === "free" && (
        <p className="text-sm text-blue-500">
          Gunakan IB Code untuk mendapatkan 30 hari akses gratis ke indikator.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Form Permintaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="TradingView Username kamu"
            disabled={disabled}
          />
          {(role === "free" || role === "subscriber") && (
            <Input
              value={ibCode}
              onChange={(e) => setIbCode(e.target.value)}
              placeholder="Masukkan IB Code (optional)"
            />
          )}
          <Button onClick={handleSubmit} disabled={submitting || disabled}>
            {submitting ? "Mengirim..." : "Kirim Permintaan"}
          </Button>
          {disabled && (
            <p className="text-sm text-red-500">
              Kamu telah mencapai batas klaim ({role === "free" ? "1x per trial" : "1x per 24 jam"})
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Permintaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {requests.map((r) => (
            <div key={r.id} className="border-b pb-2">
              <div className="flex justify-between text-sm">
                <span>@{r.tradingview_username}</span>
                <span className={`capitalize ${r.status === "approved" ? "text-green-600" : r.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>
                  {r.status}
                </span>
              </div>
              {r.notes && <div className="text-xs text-muted-foreground italic">{r.notes}</div>}
              <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

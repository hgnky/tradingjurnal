"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-browser"
import { useUser } from "@/context/user-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { type Database } from "@/types/supabase"

type Forecast = Database["public"]["Tables"]["ai_forecasts"]["Row"]

export default function AdminForecastPage() {
  const { user, role, loading } = useUser()
  const [pair, setPair] = useState("EUR/USD")
  const [timeframe, setTimeframe] = useState("H1")
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [forecasts, setForecasts] = useState<Forecast[]>([])

  useEffect(() => {
    if (!loading && role !== "admin") {
      window.location.href = "/unauthorized"
    }
  }, [role, loading])

  const fetchForecasts = async () => {
    const { data } = await supabase
      .from("ai_forecasts")
      .select("*")
      .order("created_at", { ascending: false })

    setForecasts(data || [])
  }

  useEffect(() => {
    fetchForecasts()
  }, [])

  const handleGenerate = async () => {
    if (!prompt) return toast.error("Prompt tidak boleh kosong")

    setIsLoading(true)

    const res = await fetch("/api/admin/forecast/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, pair, timeframe }),
    })

    const json = await res.json()

    if (!res.ok) {
      toast.error("Gagal generate forecast")
      setIsLoading(false)
      return
    }

    const { forecast } = json

    const { data, error } = await supabase
      .from("ai_forecasts")
      .insert({
        title: `${pair} ${timeframe}`,
        content: forecast,
        pair,
        timeframe,
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) {
      toast.error("Gagal simpan forecast")
    } else {
      setForecasts((prev) => [data, ...prev])
      setPrompt("")
      toast.success("Forecast berhasil dibuat")
    }

    setIsLoading(false)
  }

  const lastForecast = forecasts?.[0]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Forecast (Admin)</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Forecast Baru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input value={pair} onChange={(e) => setPair(e.target.value)} placeholder="Pair (e.g. EUR/USD)" />
            <Input value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="Timeframe (e.g. H1)" />
          </div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Prompt AI (optional, bisa diisi: 'forecast arah harga besok berdasarkan NFP')"
          />
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Menghasilkan..." : "Generate Forecast"}
          </Button>
        </CardContent>
      </Card>

      {lastForecast && (
        <Card>
          <CardHeader>
            <CardTitle>Last Signal: {lastForecast.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm text-muted-foreground">{lastForecast.content}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>History Signal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {forecasts.slice(1).map((f) => (
            <div key={f.id} className="border-b pb-3">
              <div className="font-semibold">{f.title}</div>
              <div className="text-sm text-muted-foreground whitespace-pre-line">{f.content}</div>
              <div className="text-xs mt-1 text-right text-gray-500">{new Date(f.created_at).toLocaleString()}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

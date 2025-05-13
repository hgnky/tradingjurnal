'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Forecast = {
  id: string
  title: string
  content: string
  pair: string
  timeframe: string
  created_at: string
}

export default function ForecastPage() {
  const { user, role, isLoading } = useUser()
  const router = useRouter()
  const [data, setData] = useState<Forecast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    } else if (!isLoading && user && !['subscriber', 'raider', 'admin'].includes(role)) {
      router.push('/dashboard/upgrade')
    }
  }, [user, role, isLoading])

  useEffect(() => {
    const fetchForecasts = async () => {
      const { data, error } = await supabase
        .from('ai_forecasts')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setData(data || [])
      setLoading(false)
    }

    fetchForecasts()
  }, [])

  if (loading || isLoading || !user) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Forecast</h1>

      {data.length === 0 && (
        <p className="text-muted-foreground">No forecast available yet.</p>
      )}

      {data.map((f) => (
        <Card key={f.id}>
          <CardHeader>
            <CardTitle>{f.title} ({f.pair} – {f.timeframe})</CardTitle>
            <p className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString()}</p>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap">{f.content}</CardContent>
        </Card>
      ))}
    </div>
  )
}

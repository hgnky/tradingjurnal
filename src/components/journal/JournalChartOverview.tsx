'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'
import Chart from 'chart.js/auto'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

export function JournalChartOverview({ userId }: { userId: string }) {
  const [data, setData] = useState<any[]>([])

  const barRef = useRef<HTMLCanvasElement | null>(null)
  const sessionRef = useRef<HTMLCanvasElement | null>(null)
  const dayRef = useRef<HTMLCanvasElement | null>(null)
  const pairRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('journals')
        .select('date, pnl, session, asset')
        .eq('user_id', userId)
      setData(data || [])
    }

    fetch()
  }, [userId])

  useEffect(() => {
    if (!data.length) return

    Chart.getChart(barRef.current!)?.destroy()
    Chart.getChart(sessionRef.current!)?.destroy()
    Chart.getChart(dayRef.current!)?.destroy()
    Chart.getChart(pairRef.current!)?.destroy()

    const pnlByDay: Record<string, number> = {}
    const sessionMap: Record<string, number> = {}
    const dayMap: Record<string, number> = {}
    const pairMap: Record<string, number> = {}

    data.forEach((j) => {
      const date = dayjs(j.date).format('YYYY-MM-DD')
      const session = j.session || 'Unknown'
      const day = dayjs(j.date).format('dddd')
      const pair = j.asset?.toUpperCase() || '-'
      const pnl = j.pnl || 0

      pnlByDay[date] = (pnlByDay[date] || 0) + pnl
      sessionMap[session] = (sessionMap[session] || 0) + pnl
      dayMap[day] = (dayMap[day] || 0) + pnl
      pairMap[pair] = (pairMap[pair] || 0) + pnl
    })

    new Chart(barRef.current!, {
      type: 'bar',
      data: {
        labels: Object.keys(pnlByDay),
        datasets: [{
          label: 'PnL',
          data: Object.values(pnlByDay),
          backgroundColor: '#00b894',
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { display: false }, grid: { display: false } },
          y: { ticks: { display: false }, grid: { display: false } }
        }
      }
    })

    const radarOpts = {
      type: 'radar' as const,
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            ticks: { display: false },
            angleLines: { display: false },
            grid: { color: '#444' }
          }
        }
      }
    }

    new Chart(sessionRef.current!, {
      ...radarOpts,
      data: {
        labels: Object.keys(sessionMap),
        datasets: [{
          label: 'Session',
          data: Object.values(sessionMap),
          backgroundColor: 'rgba(9,132,227,0.4)',
          borderColor: '#0984e3',
          borderWidth: 2
        }]
      }
    })

    new Chart(dayRef.current!, {
      ...radarOpts,
      data: {
        labels: Object.keys(dayMap),
        datasets: [{
          label: 'Day',
          data: Object.values(dayMap),
          backgroundColor: 'rgba(253,203,110,0.4)',
          borderColor: '#fdcb6e',
          borderWidth: 2
        }]
      }
    })

    new Chart(pairRef.current!, {
      ...radarOpts,
      data: {
        labels: Object.keys(pairMap),
        datasets: [{
          label: 'Pair',
          data: Object.values(pairMap),
          backgroundColor: 'rgba(225,112,85,0.4)',
          borderColor: '#e17055',
          borderWidth: 2
        }]
      }
    })
  }, [data])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <ChartCard title="📊 PnL by Day">
        <canvas ref={barRef} className="max-w-full h-[200px]" />
      </ChartCard>

      <ChartCard title="🕒 Session">
        <canvas ref={sessionRef} className="max-w-full h-[200px]" />
      </ChartCard>

      <ChartCard title="📅 Day">
        <canvas ref={dayRef} className="max-w-full h-[200px]" />
      </ChartCard>

      <ChartCard title="📈 Pair">
        <canvas ref={pairRef} className="max-w-full h-[200px]" />
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex justify-center">
        <div className="w-[90%]">{children}</div>
      </CardContent>
    </Card>
  )
}

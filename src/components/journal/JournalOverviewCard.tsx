'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import {
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  Clock,
  Trophy,
  BarChart2,
  Zap
} from 'lucide-react'

type Journal = {
  pnl: number
  rr: number
  session: string
  asset: string
}

export default function JournalOverviewCard({ userId }: { userId: string }) {
  const [data, setData] = useState<Journal[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('journals')
        .select('pnl, rr, session, asset')
        .eq('user_id', userId)

      setData(data || [])
    }

    fetchData()
  }, [userId])

  if (data.length === 0) return null

  const totalTrades = data.length
  const totalPnL = data.reduce((sum, j) => sum + (j.pnl || 0), 0)
  const wins = data.filter((j) => j.pnl > 0)
  const losses = data.filter((j) => j.pnl < 0)
  const winrate = (wins.length / totalTrades) * 100
  const avgRR =
    data.reduce((sum, j) => sum + (parseFloat(j.rr) || 0), 0) / totalTrades

  const profitFactor =
    losses.length === 0
      ? '∞'
      : (
          wins.reduce((sum, j) => sum + j.pnl, 0) /
          Math.abs(losses.reduce((sum, j) => sum + j.pnl, 0))
        ).toFixed(2)

  const sessionCount: Record<string, number> = {}
  data.forEach((j) => {
    if (!sessionCount[j.session]) sessionCount[j.session] = 0
    sessionCount[j.session]++
  })
  const bestSession =
    Object.entries(sessionCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

  const pairProfit: Record<string, number> = {}
  data.forEach((j) => {
    const key = j.asset?.toUpperCase() || '-'
    pairProfit[key] = (pairProfit[key] || 0) + (j.pnl || 0)
  })
  const bestPair =
    Object.entries(pairProfit).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

  const getStreaks = () => {
    let maxWin = 0, maxLoss = 0, currentWin = 0, currentLoss = 0

    data.forEach((j) => {
      if (j.pnl > 0) {
        currentWin++
        currentLoss = 0
        if (currentWin > maxWin) maxWin = currentWin
      } else if (j.pnl < 0) {
        currentLoss++
        currentWin = 0
        if (currentLoss > maxLoss) maxLoss = currentLoss
      } else {
        currentWin = 0
        currentLoss = 0
      }
    })

    return { maxWin, maxLoss }
  }

  const { maxWin, maxLoss } = getStreaks()

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Journal Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Stat label="Total PnL" value={`$${totalPnL.toFixed(2)}`} icon={<DollarSign className="h-4 w-4 text-green-500" />} />
          <Stat label="Winrate" value={`${winrate.toFixed(1)}%`} icon={<Percent className="h-4 w-4 text-blue-500" />} />
          <Stat label="Avg RR" value={avgRR.toFixed(2)} icon={<BarChart2 className="h-4 w-4 text-yellow-500" />} />
          <Stat label="Profit Factor" value={profitFactor} icon={<Zap className="h-4 w-4 text-purple-500" />} />
          <Stat label="Win Streak" value={`${maxWin}x`} icon={<TrendingUp className="h-4 w-4 text-green-400" />} />
          <Stat label="Loss Streak" value={`${maxLoss}x`} icon={<TrendingDown className="h-4 w-4 text-red-400" />} />
          <Stat label="Best Session" value={capitalize(bestSession)} icon={<Clock className="h-4 w-4 text-cyan-500" />} />
          <Stat label="Best Pair" value={bestPair} icon={<Trophy className="h-4 w-4 text-orange-500" />} />
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-muted/60 p-4 rounded-lg flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-base font-semibold text-foreground">{value}</div>
    </div>
  )
}

function capitalize(text: string) {
  return text?.charAt(0).toUpperCase() + text?.slice(1)
}

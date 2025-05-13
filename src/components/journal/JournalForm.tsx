'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

export function JournalForm({
  userId,
  onSuccess,
}: {
  userId: string
  onSuccess?: () => void
}) {
  const [form, setForm] = useState({
    asset: '',
    entry_price: '',
    exit_price: '',
    sl: '',
    tp: '',
    lot_size: '',
    rr: '',
    pnl: '',
    strategy: '',
    daily_bias: '',
    htf: '',
    entry_tf: '',
    session: '',
    mood: '',
    tradingview_link: '',
    reason_entry: '',
    notes: '',
  })

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState('00:00')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ep = parseFloat(form.entry_price)
    const tp = parseFloat(form.tp)
    const sl = parseFloat(form.sl)
    if (!isNaN(ep) && !isNaN(tp) && !isNaN(sl) && ep !== sl) {
      const rr = Math.abs(tp - ep) / Math.abs(ep - sl)
      setForm((prev) => ({ ...prev, rr: rr.toFixed(2) }))
    }
  }, [form.entry_price, form.tp, form.sl])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!date || !form.asset || !form.entry_price || !form.exit_price) {
      setError('Tanggal, Asset, Entry, dan Exit wajib diisi.')
      return
    }

    const fullDate = new Date(date)
    const [hh, mm] = time.split(':')
    fullDate.setHours(Number(hh), Number(mm))

    setLoading(true)
    const { error } = await supabase.from('journals').insert({
      user_id: userId,
      date: fullDate.toISOString(),
      ...form,
      entry_price: parseFloat(form.entry_price),
      exit_price: parseFloat(form.exit_price),
      sl: parseFloat(form.sl),
      tp: parseFloat(form.tp),
      lot_size: parseFloat(form.lot_size),
      rr: parseFloat(form.rr),
      pnl: parseFloat(form.pnl),
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      onSuccess?.()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Date Picker */}
        <div>
          <Label>Tanggal *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Waktu</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div>
          <Label>Asset *</Label>
          <Input
            name="asset"
            placeholder="EUR/USD, BTC/USD"
            value={form.asset}
            onChange={handleChange}
          />
        </div>

        <div><Label>Entry</Label><Input name="entry_price" value={form.entry_price} onChange={handleChange} /></div>
        <div><Label>Exit</Label><Input name="exit_price" value={form.exit_price} onChange={handleChange} /></div>
        <div><Label>SL</Label><Input name="sl" value={form.sl} onChange={handleChange} /></div>
        <div><Label>TP</Label><Input name="tp" value={form.tp} onChange={handleChange} /></div>
        <div><Label>Lot</Label><Input name="lot_size" value={form.lot_size} onChange={handleChange} /></div>
        <div><Label>RR (auto)</Label><Input value={form.rr} disabled /></div>
        <div><Label>PnL</Label><Input name="pnl" value={form.pnl} onChange={handleChange} /></div>
        <div><Label>Strategy</Label><Input name="strategy" value={form.strategy} onChange={handleChange} /></div>

        <div>
          <Label>Bias</Label>
          <Select
            value={form.daily_bias}
            onValueChange={(val) => setForm((p) => ({ ...p, daily_bias: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih bias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bullish">Bullish</SelectItem>
              <SelectItem value="bearish">Bearish</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Session</Label>
          <Select
            value={form.session}
            onValueChange={(val) => setForm((p) => ({ ...p, session: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih sesi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="london">London</SelectItem>
              <SelectItem value="newyork">New York</SelectItem>
              <SelectItem value="off_session">Off Session</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div><Label>HTF</Label><Input name="htf" value={form.htf} onChange={handleChange} /></div>
        <div><Label>Entry TF</Label><Input name="entry_tf" value={form.entry_tf} onChange={handleChange} /></div>
        <div><Label>Chart Link</Label><Input name="tradingview_link" value={form.tradingview_link} onChange={handleChange} /></div>
        <div className="md:col-span-3"><Label>Reason Entry</Label><Textarea name="reason_entry" value={form.reason_entry} onChange={handleChange} /></div>
        <div className="md:col-span-3"><Label>Catatan</Label><Textarea name="notes" value={form.notes} onChange={handleChange} /></div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Save Journal'}
      </Button>
    </div>
  )
}

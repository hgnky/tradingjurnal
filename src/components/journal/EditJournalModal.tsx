'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'

export default function EditJournalModal({
  journal,
  open,
  onClose,
  onUpdated,
}: {
  journal: any
  open: boolean
  onClose: () => void
  onUpdated: () => void
}) {
  const [form, setForm] = useState(journal)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm(journal)
  }, [journal])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: value }))
  }

  const autoRR = () => {
    const ep = parseFloat(form.entry_price)
    const tp = parseFloat(form.tp)
    const sl = parseFloat(form.sl)
    if (!isNaN(ep) && !isNaN(tp) && !isNaN(sl) && ep !== sl) {
      const rr = Math.abs(tp - ep) / Math.abs(ep - sl)
      return rr.toFixed(2)
    }
    return form.rr
  }

  const handleUpdate = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('journals')
      .update({
        entry_price: parseFloat(form.entry_price),
        exit_price: parseFloat(form.exit_price),
        sl: parseFloat(form.sl),
        tp: parseFloat(form.tp),
        lot_size: parseFloat(form.lot_size),
        rr: autoRR(),
        pnl: parseFloat(form.pnl),
        strategy: form.strategy,
        reason_entry: form.reason_entry,
        tradingview_link: form.tradingview_link,
        notes: form.notes,
      })
      .eq('id', journal.id)

    setLoading(false)
    if (!error) {
      onUpdated()
      onClose()
    } else {
      alert('Update gagal: ' + error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Journal</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Entry</Label>
            <Input name="entry_price" value={form.entry_price} onChange={handleChange} />
          </div>
          <div>
            <Label>Exit</Label>
            <Input name="exit_price" value={form.exit_price} onChange={handleChange} />
          </div>
          <div>
            <Label>SL</Label>
            <Input name="sl" value={form.sl} onChange={handleChange} />
          </div>
          <div>
            <Label>TP</Label>
            <Input name="tp" value={form.tp} onChange={handleChange} />
          </div>
          <div>
            <Label>Lot Size</Label>
            <Input name="lot_size" value={form.lot_size} onChange={handleChange} />
          </div>
          <div>
            <Label>RR (auto)</Label>
            <Input value={autoRR()} disabled />
          </div>
          <div>
            <Label>PNL</Label>
            <Input name="pnl" value={form.pnl} onChange={handleChange} />
          </div>
          <div>
            <Label>Strategy</Label>
            <Input name="strategy" value={form.strategy} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label>Reason Entry</Label>
            <Textarea name="reason_entry" value={form.reason_entry} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label>Chart Link (TradingView)</Label>
            <Input name="tradingview_link" value={form.tradingview_link} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label>Notes</Label>
            <Textarea name="notes" value={form.notes} onChange={handleChange} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

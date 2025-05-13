'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { Trash, Pencil } from 'lucide-react'
import EditJournalModal from './EditJournalModal'

// Простая функция PnL: (exitPrice - entryPrice) * lotSize
function calculatePnL(entryPrice: number, exitPrice: number, lotSize: number): string {
  const pnl = (exitPrice - entryPrice) * lotSize
  return pnl.toFixed(2)
}

export function JournalTable({ userId }: { userId: string }) {
  const [journals, setJournals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (!error) setJournals(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [userId])

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus jurnal ini?')) return
    await supabase.from('journals').delete().eq('id', id)
    fetchData()
  }

  if (loading) return <div className="p-4">Loading journal...</div>
  if (!journals.length) return <div className="p-4 text-muted-foreground">Belum ada data.</div>

  return (
    <>
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left border-b">
              <th className="p-2">Tanggal</th>
              <th className="p-2">Asset</th>
              <th className="p-2">Entry</th>
              <th className="p-2">Exit</th>
              <th className="p-2">SL</th>
              <th className="p-2">TP</th>
              <th className="p-2">RR</th>
              <th className="p-2">Lot</th>
              <th className="p-2">PnL</th>
              <th className="p-2">Bias</th>
              <th className="p-2">Session</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {journals.map((j) => (
              <tr key={j.id} className="border-b hover:bg-muted/50">
                <td className="p-2">{dayjs(j.date).format('YYYY-MM-DD HH:mm')}</td>
                <td className="p-2 font-semibold">{j.asset}</td>
                <td className="p-2">{j.entry_price}</td>
                <td className="p-2">{j.exit_price}</td>
                <td className="p-2">{j.sl}</td>
                <td className="p-2">{j.tp}</td>
                <td className="p-2">{j.rr}</td>
                <td className="p-2">{j.lot_size}</td>
                <td className="p-2">
                  {j.entry_price != null && j.exit_price != null && j.lot_size != null
                    ? calculatePnL(
                        parseFloat(j.entry_price),
                        parseFloat(j.exit_price),
                        parseFloat(j.lot_size)
                      )
                    : '-'}
                </td>
                <td className="p-2 capitalize">{j.daily_bias}</td>
                <td className="p-2 capitalize">{j.session}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelected(j)
                        setModalOpen(true)
                      }}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(j.id)}
                    >
                      <Trash size={16} className="text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <EditJournalModal
          journal={selected}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onUpdated={fetchData}
        />
      )}
    </>
  )
}

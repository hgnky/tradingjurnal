'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function ExportJournalButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', userId)

    if (error || !data) {
      console.error('Gagal ambil data jurnal:', error)
      setLoading(false)
      return
    }

    // ✅ Ambil hanya kolom penting untuk ekspor
    const filteredData = data.map(
      ({
        date,
        asset,
        entry_price,
        exit_price,
        sl,
        tp,
        lot_size,
        rr,
        pnl,
        strategy,
        session
      }) => ({
        Date: date,
        Asset: asset,
        Entry: entry_price,
        Exit: exit_price,
        SL: sl,
        TP: tp,
        Lot: lot_size,
        RR: rr,
        PnL: pnl,
        Strategy: strategy,
        Session: session
      })
    )

    const worksheet = XLSX.utils.json_to_sheet(filteredData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Journals')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })

    saveAs(blob, 'journal_export.xlsx')
    setLoading(false)
  }

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline" className="flex items-center gap-2">
      <FileDown size={16} />
      {loading ? 'Exporting...' : 'Export as Excel'}
    </Button>
  )
}

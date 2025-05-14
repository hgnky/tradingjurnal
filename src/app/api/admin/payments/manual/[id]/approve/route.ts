import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').slice(-2)[0] // ambil ID dari path sebelum /approve

  if (!id) {
    return NextResponse.json({ error: 'Missing manual_payment ID' }, { status: 400 })
  }

  // Update status ke approved
  const { error } = await supabase
    .from('manual_payments')
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

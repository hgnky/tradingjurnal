import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() // ambil ID dari path akhir

  const body = await req.json()
  const { title, content } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing material ID' }, { status: 400 })
  }

  const { error } = await supabase
    .from('materials')
    .update({ title, content })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function PUT(req: Request) {
  const supabase = createServerActionClient({ cookies })

  const url = new URL(req.url)
  const id = url.pathname.split('/').slice(-2)[0] // Ambil ID sebelum "/approve"

  if (!id) {
    return Response.json({ error: 'Missing payment ID' }, { status: 400 })
  }

  const { error } = await supabase
    .from('manual_payments')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}

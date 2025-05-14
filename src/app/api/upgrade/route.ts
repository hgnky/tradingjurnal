import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = createServerClient()

  const { plan, amount } = await req.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // simpan invoice manual
  await supabase.from('invoices').insert({
    user_id: user.id,
    amount,
    description: `Upgrade ke ${plan}`,
  })

  // update role (manual)
  if (plan === 'subscriber') {
    await supabase
      .from('users')
      .update({ role_id: 2 })  // sesuaikan ID role
      .eq('id', user.id);
  } else if (plan === 'raider') {
    await supabase
      .from('users')
      .update({ role_id: 3 })  // sesuaikan ID role
      .eq('id', user.id);
  }

  return NextResponse.json({ success: true })
}

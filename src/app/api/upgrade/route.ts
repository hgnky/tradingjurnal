import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { userId, plan } = await req.json()

  if (!userId || !plan) {
    return NextResponse.json({ error: 'Missing userId or plan' }, { status: 400 })
  }

  try {
    let roleId: string | null = null

    // Get role_id from roles table based on plan name
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', plan)
      .single()

    if (roleError || !roleData) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    roleId = roleData.id

    // Update user role
    const { error: updateError } = await supabase
      .from('users')
      .update({ role_id: roleId })
      .eq('id', userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

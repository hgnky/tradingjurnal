import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const payload = await req.json()
  const { id, email_addresses, first_name } = payload

  await supabase.from("users").upsert({
    id,
    email: email_addresses[0]?.email_address,
    name: first_name,
    role_id: await getDefaultRoleId(), // bisa query langsung
    is_active: true,
    trial_ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  })

  return NextResponse.json({ ok: true })
}

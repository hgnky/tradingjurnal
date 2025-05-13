import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServerActionClient({ cookies })

  const { data: payment } = await supabase
    .from("manual_payments")
    .select("user_id, plan")
    .eq("id", params.id)
    .single()

  if (!payment) return Response.json({ error: "Not found" }, { status: 404 })

  // Ambil role_id dari tabel roles
  const { data: roles } = await supabase.from("roles").select("id, name")
  const role = roles?.find(r => r.name === payment.plan)

  if (!role) return Response.json({ error: "Invalid role" }, { status: 400 })

  await supabase.from("users").update({ role_id: role.id }).eq("id", payment.user_id)

  await supabase.from("manual_payments").update({
    status: "approved"
  }).eq("id", params.id)

  return Response.json({ success: true })
}

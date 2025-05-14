import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  const supabase = createServerActionClient({ cookies })

  await supabase.from("manual_payments").update({
    status: "rejected"
  }).eq("id", params.id)

  return Response.json({ success: true })
}

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const supabase = createServerActionClient({ cookies })
  const { title, content, level } = body

  const { error } = await supabase
    .from("materials")
    .update({ title, content, level })
    .eq("id", params.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

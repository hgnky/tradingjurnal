// app/api/admin/forecast/generate/route.ts
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { prompt, pair, timeframe } = body

  const fullPrompt = prompt || `Buat analisa teknikal dan outlook ${pair} di timeframe ${timeframe} untuk 1 hari ke depan.`

  const res = await fetch(process.env.AI_API_URL!, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: fullPrompt }),
  })

  if (!res.ok) {
    return new Response("Gagal dari AI API", { status: 500 })
  }

  const json = await res.json()
  return Response.json({ forecast: json.result || json.forecast || "No result" })
}

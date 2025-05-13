import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const body = await req.json()
  const { prompt, pair, timeframe } = body

  const fullPrompt =
    prompt ||
    `Buat analisa teknikal dan outlook ${pair} di timeframe ${timeframe} untuk 1 hari ke depan. Sertakan alasan analisis dan kesimpulan.`

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4", // bisa diganti jadi "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah analis teknikal forex yang profesional. Jawab singkat, padat, dan rapi.",
        },
        { role: "user", content: fullPrompt },
      ],
      temperature: 0.7,
    }),
  })

  if (!openaiRes.ok) {
    const errText = await openaiRes.text()
    return new Response(`Gagal dari OpenAI: ${errText}`, { status: 500 })
  }

  const ai = await openaiRes.json()
  const forecast = ai.choices?.[0]?.message?.content || "Tidak ada hasil."

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Simpan log permintaan AI (untuk audit)
  await supabase.from("ai_forecast_requests").insert({
    user_id: session.user.id,
    input_text: fullPrompt,
    result: forecast,
  })

  return Response.json({ forecast })
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set(key, value, options)
        },
        remove: (key, options) => {
          res.cookies.set(key, "", { ...options, maxAge: -1 })
        }
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (req.nextUrl.pathname === "/dashboard" && user) {
    const { data } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", user.id)
      .single()

    if (data?.role_id === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/dashboard"],
}

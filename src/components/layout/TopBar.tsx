"use client"

import { useUser } from "@/context/user-context"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TopBar() {
  const { user, role, loading } = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) return <div className="w-full border-b px-6 py-3 text-sm">Loading...</div>
  if (!user) return null

  const name = user.user_metadata?.name || "Trader"
  const initials = name.charAt(0).toUpperCase()

  return (
    <div className="w-full border-b px-6 py-3 flex items-center justify-between bg-white dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground capitalize">{role || "no role"}</p>
        </div>
      </div>

      <Button size="sm" variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}

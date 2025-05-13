'use client'

import { useUser } from '@/context/user-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut, UserCircle } from 'lucide-react'

export default function TopBar() {
  const { user, role } = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="m-4 mb-0 rounded-xl border border-white/10 bg-background/70 backdrop-blur-md px-6 py-4 shadow-md flex items-center justify-between">
      <div className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
        Welcome, {user?.user_metadata?.name || user?.email}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground capitalize">
          <UserCircle size={18} />
          {role}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  )
}

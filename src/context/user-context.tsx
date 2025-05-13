"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

type UserContextType = {
  user: User | null
  role: string | null
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  role: null,
  loading: true,
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log("🔍 Supabase Auth User:", user)
      if (userError) console.error("❌ Error fetching auth user:", userError)

      setUser(user)

      if (user) {
        // Step 1: Ambil role_id dari users
        const { data: userData, error: userErr } = await supabase
          .from("users")
          .select("role_id")
          .eq("id", user.id)
          .single()

        if (userErr) console.error("❌ Error fetching role_id:", userErr)

        const roleId = userData?.role_id

        // Step 2: Ambil nama role dari roles table
        if (roleId) {
          const { data: roleData, error: roleErr } = await supabase
            .from("roles")
            .select("name")
            .eq("id", roleId)
            .single()

          if (roleErr) console.error("❌ Error fetching role name:", roleErr)
          if (roleData?.name) setRole(roleData.name)
        }
      }

      setLoading(false)
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, role, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

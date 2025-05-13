"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type UserContextType = {
  user: any
  role: string | null
}

const UserContext = createContext<UserContextType>({ user: null, role: null })

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase.from("users").select("role_id").eq("id", user.id).single()
        if (data?.role_id) setRole(data.role_id) // misalnya: "free", "admin"
      }
    }

    getUser()
  }, [])

  return <UserContext.Provider value={{ user, role }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)

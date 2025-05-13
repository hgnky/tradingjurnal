"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"

export function useRoleGuard(allowed: string[]) {
  const { role, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Tunggu sampai loading selesai
    if (loading) return

    // Jika role tidak ada (belum login), redirect ke login
    if (!role) {
      router.push("/auth/login")
      return
    }

    // Jika role tidak diizinkan, redirect ke unauthorized
    if (!allowed.includes(role)) {
      router.push("/auth/login")
    }
  }, [role, loading])
}

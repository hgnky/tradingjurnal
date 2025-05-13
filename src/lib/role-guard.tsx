"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"

export function useRoleGuard(allowed: string[]) {
  const { role } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (role && !allowed.includes(role)) {
      router.push("/unauthorized")
    }
  }, [role])
}

"use client"

import { useUser } from "@/context/user-context"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user, role } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role) setLoading(false)
  }, [role])

  if (loading) return <p className="p-4">Loading...</p>
  if (!user) return <p className="p-4">Unauthorized</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Selamat datang di AudenFX 👋</h1>
      <p className="text-muted-foreground mb-6">Role Anda: <strong>{role}</strong></p>

      {role === "free" && (
        <div className="space-y-2">
          <p>Anda sedang dalam masa trial. Upgrade untuk akses penuh.</p>
        </div>
      )}

      {role === "subscriber" && (
        <div className="space-y-2">
          <p>Anda adalah <strong>Subscriber</strong>. Nikmati akses penuh ke jurnal dan materi basic.</p>
        </div>
      )}

      {role === "raider" && (
        <div className="space-y-2">
          <p>Anda adalah <strong>Raider</strong>. Anda punya akses penuh ke semua fitur dan materi premium.</p>
        </div>
      )}

      {role === "admin" && (
        <div className="space-y-2">
          <p>Anda adalah <strong>Admin</strong>. Gunakan panel admin untuk mengelola sistem.</p>
        </div>
      )}
    </div>
  )
}

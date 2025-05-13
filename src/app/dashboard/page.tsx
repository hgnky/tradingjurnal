"use client"

import { useUser } from "@/context/user-context"

export default function DashboardPage() {
  const { user, role, loading } = useUser()

  if (loading) return <div className="p-4">Loading...</div>
  if (!user) return <div className="p-4 text-red-500">Unauthorized</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Selamat datang, {user.user_metadata.name || "Trader"} 👋</h1>
      <p className="text-muted-foreground mb-6">Role Anda: <strong>{role}</strong></p>

      {role === "free" && (
        <div className="rounded-xl border p-4 bg-yellow-50 text-yellow-800">
          Anda sedang dalam masa trial. Upgrade ke <strong>Subscriber</strong> untuk akses penuh ke jurnal dan forecast.
        </div>
      )}

      {role === "subscriber" && (
        <div className="rounded-xl border p-4 bg-green-50 text-green-800">
          Anda adalah <strong>Subscriber</strong>. Anda memiliki akses penuh ke jurnal dan materi basic.
        </div>
      )}

      {role === "raider" && (
        <div className="rounded-xl border p-4 bg-blue-50 text-blue-800">
          Anda adalah <strong>Raider</strong>. Nikmati semua fitur, termasuk materi premium dan AI Forecast.
        </div>
      )}

      {role === "admin" && (
        <div className="rounded-xl border p-4 bg-gray-100 text-gray-800">
          Anda adalah <strong>Admin</strong>. Silakan kelola sistem melalui <strong>Admin Panel</strong>.
        </div>
      )}
    </div>
  )
}

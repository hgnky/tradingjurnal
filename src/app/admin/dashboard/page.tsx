"use client"

import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboard() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.replace("/unauthorized")
      }
    }
  }, [user, loading])

  if (loading || !user) {
    return <p className="text-center mt-10">Memuat...</p>
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Selamat datang, {user.name || user.email}</p>
      <p>Role Anda: <strong>{user.role}</strong></p>
    </div>
  )
}

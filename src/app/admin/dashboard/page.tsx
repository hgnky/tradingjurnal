"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AdminDashboardPage() {
  const { user, role, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.push("/unauthorized")
    }
  }, [role, loading])

  if (loading || role !== "admin") return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardLink title="Manage Users" href="/admin/users" />
        <CardLink title="Journals Monitor" href="/admin/journals" />
        <CardLink title="Materials Manager" href="/admin/materials" />
        <CardLink title="AI Forecasts" href="/admin/forecasts" />
        <CardLink title="Manual Payments" href="/admin/payments" />
        <CardLink title="Admin Logs" href="/admin/logs" />
      </div>
    </div>
  )
}

function CardLink({ title, href }: { title: string; href: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <a href={href} className="text-blue-500 hover:underline text-sm">Open</a>
      </CardContent>
    </Card>
  )
}

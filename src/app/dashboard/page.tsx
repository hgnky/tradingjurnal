'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, role, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login')
    if (!isLoading && role === 'admin') router.push('/admin/dashboard')
  }, [user, role, isLoading])

  if (isLoading || !user) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name || user.email}
        </h1>
        <p className="text-muted-foreground">
          Your current role: <span className="capitalize font-medium">{role}</span>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>📒 Journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">View and manage your trading logs.</p>
            <Link href="/dashboard/journal">
              <Button variant="outline" className="w-full">Open Journal</Button>
            </Link>
          </CardContent>
        </Card>

        {(role === 'subscriber' || role === 'raider') && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>🧠 AI Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">See today's forecast from the AI.</p>
              <Link href="/dashboard/forecast">
                <Button variant="outline" className="w-full">View Forecast</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {(role === 'subscriber' || role === 'raider') && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>📚 Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Access your learning resources.</p>
              <div className="space-y-1">
                <Link href="/dashboard/materials/basic">
                  <Button variant="ghost" className="w-full justify-start">📘 Basic Materials</Button>
                </Link>
                {role === 'raider' && (
                  <Link href="/dashboard/materials/premium">
                    <Button variant="ghost" className="w-full justify-start">🔐 Premium Materials</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {role === 'free' && (
          <Card className="hover:shadow-md transition-shadow border-dashed border-2">
            <CardHeader>
              <CardTitle>🚀 Upgrade Trial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You’re on a 15-day free trial. Upgrade to unlock full access.
              </p>
              <Link href="/dashboard/upgrade">
                <Button className="w-full">Upgrade Now</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

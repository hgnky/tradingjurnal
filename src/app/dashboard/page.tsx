'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
      <h1 className="text-2xl font-bold">Welcome, {user.name || user.email}</h1>
      <p className="text-muted-foreground">Role: <span className="font-semibold capitalize">{role}</span></p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Journal</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-2 text-sm">View and add trades</p>
            <Link href="/journal" className="text-blue-500 hover:underline">Open Journal</Link>
          </CardContent>
        </Card>

        {(role === 'subscriber' || role === 'raider') && (
          <Card>
            <CardHeader><CardTitle>AI Forecast</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">Today’s forecast</p>
              <Link href="/forecast" className="text-blue-500 hover:underline">View Forecast</Link>
            </CardContent>
          </Card>
        )}

        {(role === 'subscriber' || role === 'raider') && (
          <Card>
            <CardHeader><CardTitle>Materials</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">Access learning</p>
              <Link href="/materials/basic" className="text-blue-500 hover:underline">Basic</Link><br />
              {role === 'raider' && (
                <Link href="/materials/premium" className="text-blue-500 hover:underline">Premium</Link>
              )}
            </CardContent>
          </Card>
        )}

        {role === 'free' && (
          <Card>
            <CardHeader><CardTitle>Upgrade</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">Trial active. Unlock full access.</p>
              <Link href="/upgrade" className="text-blue-500 hover:underline">Upgrade Now</Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

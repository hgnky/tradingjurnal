'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UpgradePage() {
  const { user, role, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    } else if (!isLoading && user && role === 'raider') {
      router.push('/dashboard') // sudah lifetime, redirect
    }
  }, [user, role, isLoading])

  if (isLoading || !user) return <div className="p-4">Loading...</div>

  const showSubscriberPlan = role === 'free'
  const showRaiderPlan = role === 'free' || role === 'subscriber'

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Upgrade Your Plan</h1>

      <p className="text-muted-foreground">
        {role === 'subscriber'
          ? 'Upgrade ke plan Lifetime untuk akses premium selamanya.'
          : 'Your trial is limited. Upgrade now to unlock full access!'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Subscriber Plan (hanya tampil jika role = free) */}
        {showSubscriberPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly/Yearly Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm list-disc pl-4">
                <li>Full Journal Access</li>
                <li>Basic Materials</li>
                <li>AI Forecast View</li>
                <li>Support Monthly or Yearly</li>
              </ul>
              <div className="flex gap-2">
                <Link href="/dashboard/checkout/manual/subscriber">
                  <Button variant="outline">Manual Transfer</Button>
                </Link>
                <Link href="/dashboard/checkout/stripe/subscriber">
                  <Button>Pay with Card</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Raider Plan (untuk free & subscriber) */}
        {showRaiderPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Raider (Lifetime)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm list-disc pl-4">
                <li>All Subscriber Benefits</li>
                <li>Premium Materials</li>
                <li>One-Time Payment</li>
                <li>Lifetime Access</li>
              </ul>
              <div className="flex gap-2">
                <Link href="/dashboard/checkout/manual/raider">
                  <Button variant="outline">Manual Transfer</Button>
                </Link>
                <Link href="/dashboard/checkout/stripe/raider">
                  <Button>Pay with Card</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import { Button } from '@/components/ui/button'
import JournalOverviewCard from '@/components/journal/JournalOverviewCard'
import { JournalChartOverview } from '@/components/journal/JournalChartOverview'
import { JournalTable } from '@/components/journal/JournalTable'
import AddJournalModal from '@/components/journal/AddJournalModal'
import ExportJournalButton from '@/components/journal/ExportJournalButton'

export default function DashboardJournalPage() {
  const { user, role, isLoading } = useUser()
  const router = useRouter()

  const [showAddModal, setShowAddModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => setRefreshKey((prev) => prev + 1)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    } else if (!isLoading && role === 'free') {
      router.push('/dashboard/upgrade')
    }
  }, [user, role, isLoading, router])

  if (isLoading || !user) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">My Trade Journal</h1>
        <div className="flex items-center gap-2">
          <ExportJournalButton userId={user.id} />
          <Button onClick={() => setShowAddModal(true)}>Add Trade</Button>
        </div>
      </div>

      <AddJournalModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        userId={user.id}
        onUpdated={handleRefresh}
      />

      <JournalOverviewCard userId={user.id} key={`overview-${refreshKey}`} />
      <JournalChartOverview userId={user.id} key={`chart-${refreshKey}`} />
      <JournalTable userId={user.id} key={`table-${refreshKey}`} />
    </div>
  )
}

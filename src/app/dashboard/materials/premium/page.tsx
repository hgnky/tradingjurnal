'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle, FileText, UserCircle } from 'lucide-react'
import clsx from 'clsx'

const premiumMaterials = [
  {
    id: 'smart-money',
    title: 'Smart Money Concepts',
    description: 'Pemahaman supply/demand dan market structure ala institusi.',
    videoUrl: 'https://www.youtube.com/embed/hx3dS2jaKOY',
    pdfUrl: '/materials/premium/smart-money.pdf',
    author: 'Admin AudenFX',
  },
  {
    id: 'risk-management-advance',
    title: 'Advanced Risk Management',
    description: 'Strategi alokasi risiko tingkat lanjut untuk konsistensi jangka panjang.',
    videoUrl: null,
    pdfUrl: '/materials/premium/risk-management-advance.pdf',
    author: 'Admin AudenFX',
  }
]

export default function PremiumMaterialsPage() {
  const { role, loading } = useUser()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState(premiumMaterials[0].id)

  const canAccess = role === 'raider'

  useEffect(() => {
    if (!loading && !canAccess) {
      router.push('/dashboard/upgrade')
    }
  }, [loading, role])

  if (loading || !canAccess) return <div className="p-4">Loading...</div>

  const selected = premiumMaterials.find((item) => item.id === selectedId)!

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* CONTENT */}
      <main className="md:col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selected.videoUrl ? (
                <PlayCircle className="w-5 h-5 text-blue-500" />
              ) : (
                <FileText className="w-5 h-5 text-emerald-500" />
              )}
              {selected.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserCircle className="w-4 h-4" />
              <span>Author: {selected.author}</span>
            </div>

            <p>{selected.description}</p>

            {selected.videoUrl && (
              <div className="aspect-video">
                <iframe
                  src={selected.videoUrl}
                  title={selected.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-md border"
                />
              </div>
            )}

            {selected.pdfUrl && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={selected.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Lihat PDF
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </main>

      {/* SIDEBAR */}
      <aside className="md:col-span-1 space-y-2">
        <h2 className="text-lg font-semibold">🔐 Materi Premium</h2>
        <ul className="space-y-1">
          {premiumMaterials.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setSelectedId(item.id)}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-md text-sm',
                  item.id === selectedId
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-muted'
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

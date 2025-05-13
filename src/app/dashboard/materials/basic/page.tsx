'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user-context'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle, FileText, UserCircle } from 'lucide-react'
import clsx from 'clsx'

const basicMaterials = [
  {
    id: 'support-resistance',
    title: 'Support & Resistance',
    description: 'Dasar analisa teknikal untuk mengenali zona harga penting.',
    videoUrl: 'https://www.youtube.com/embed/7wnove7K-ZQ',
    pdfUrl: '/materials/basic/support-resistance.pdf',
    author: 'Admin AudenFX'
  },
  {
    id: 'trendline-breakout',
    title: 'Trendline & Breakout',
    description: 'Cara membaca arah tren dan potensi breakout.',
    videoUrl: 'https://www.youtube.com/embed/MLtAMgFHoRI',
    pdfUrl: null,
    author: 'Admin AudenFX'
  },
  {
    id: 'risk-management',
    title: 'Basic Risk Management',
    description: 'Cara mengukur dan mengontrol risiko dalam setiap entry.',
    videoUrl: null,
    pdfUrl: '/materials/basic/risk-management.pdf',
    author: 'Admin AudenFX'
  }
]

export default function BasicMaterialsPage() {
  const { role, loading } = useUser()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState(basicMaterials[0].id)

  const canAccess = role === 'subscriber' || role === 'raider'

  useEffect(() => {
    if (!loading && !canAccess) {
      router.push('/dashboard/upgrade')
    }
  }, [loading, role])

  if (loading || !canAccess) return <div className="p-4">Loading...</div>

  const selected = basicMaterials.find((item) => item.id === selectedId)!

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* MAIN CONTENT */}
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

      {/* SIDEBAR on RIGHT */}
      <aside className="md:col-span-1 space-y-2">
        <h2 className="text-lg font-semibold">📘 Daftar Materi</h2>
        <ul className="space-y-1">
          {basicMaterials.map((item) => (
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

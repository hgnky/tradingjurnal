'use client'

import Link from 'next/link'
import { useUser } from '@/context/user-context'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, BookOpenCheck } from 'lucide-react'
import clsx from 'clsx'

const basicMaterials = [
  {
    id: 'basic',
    title: '📘 Basic Materials',
    description: 'Materi dasar untuk memahami analisa teknikal dan manajemen risiko.',
    link: '/dashboard/materials/basic',
    access: 'Subscriber & Raider'
  }
]

const premiumMaterials = [
  {
    id: 'premium',
    title: '🔐 Premium Materials',
    description: 'Materi lanjutan seperti Smart Money dan strategi profesional.',
    link: '/dashboard/materials/premium',
    access: 'Hanya Raider'
  }
]

export default function MaterialsPage() {
  const { role } = useUser()
  const canAccessBasic = role === 'subscriber' || role === 'raider'
  const canAccessPremium = role === 'raider'

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* MAIN CONTENT */}
      <main className="md:col-span-3 space-y-6">
        <h1 className="text-2xl font-bold">📚 Materi Edukasi</h1>

        {/* Basic */}
        <section className="space-y-4">
          {basicMaterials.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenCheck className="h-5 w-5 text-blue-500" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs mt-2 text-muted-foreground">
                  Akses: <span className="font-semibold">{item.access}</span>
                </p>
              </CardContent>
              <CardFooter className="flex items-center gap-2">
                {canAccessBasic ? (
                  <Button asChild size="sm">
                    <Link href={item.link}>Lihat Materi</Link>
                  </Button>
                ) : (
                  <>
                    <Button disabled size="sm" variant="outline">
                      <Lock className="w-4 h-4 mr-1" />
                      Khusus Member
                    </Button>
                    <Button asChild size="sm" variant="default">
                      <Link href="/dashboard/upgrade">Upgrade Sekarang</Link>
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </section>

        {/* Premium */}
        <section className="space-y-4">
          {premiumMaterials.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-500" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs mt-2 text-muted-foreground">
                  Akses: <span className="font-semibold">{item.access}</span>
                </p>
              </CardContent>
              <CardFooter className="flex items-center gap-2">
                {canAccessPremium ? (
                  <Button asChild size="sm">
                    <Link href={item.link}>Lihat Materi</Link>
                  </Button>
                ) : (
                  <>
                    <Button disabled size="sm" variant="outline">
                      <Lock className="w-4 h-4 mr-1" />
                      Khusus Raider
                    </Button>
                    <Button asChild size="sm" variant="default">
                      <Link href="/dashboard/upgrade">Upgrade Sekarang</Link>
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>

      {/* SIDEBAR */}
      <aside className="md:col-span-1 space-y-4">
        <h2 className="text-lg font-semibold">📑 Navigasi Materi</h2>
        <div className="space-y-2 text-sm">
          <Link
            href="/dashboard/materials/basic"
            className={clsx(
              'block px-3 py-2 rounded-md',
              canAccessBasic
                ? 'bg-muted hover:bg-muted/70 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-muted-foreground cursor-not-allowed'
            )}
          >
            📘 Basic Materials
          </Link>

          <Link
            href="/dashboard/materials/premium"
            className={clsx(
              'block px-3 py-2 rounded-md',
              canAccessPremium
                ? 'bg-muted hover:bg-muted/70 text-red-600 dark:text-red-400 font-medium'
                : 'text-muted-foreground cursor-not-allowed'
            )}
          >
            🔐 Premium Materials
          </Link>
        </div>
      </aside>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12 flex flex-col items-center justify-center text-center gap-6">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Catat. Evaluasi. Naik Level. 🚀
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          AudenFX adalah tempatnya trader — dari yang baru belajar sampai yang udah pro. 
          Semua bisa tracking performa, belajar strategi, dan grow bareng.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button size="lg" className="w-64 sm:w-auto">
              Mulai Jurnal Sekarang ✍️
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="w-64 sm:w-auto">
              Kenapa AudenFX?
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 max-w-3xl text-left space-y-6">
        <section>
          <h2 className="text-2xl font-semibold">📈 Untuk yang Baru Mulai</h2>
          <p className="text-muted-foreground">
            Ga ngerti RR? Bingung entry/exit? Santai. Kita bantu kamu bikin habit journaling yang simple tapi impactful.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">🎯 Untuk yang Udah Ngegas</h2>
          <p className="text-muted-foreground">
            Mau liat data winrate, sesi terbaik, atau strategi paling cuan? Semua bisa di-track dan dievaluasi di dashboard kamu.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">🤖 Bonus: AI Forecast (khusus member)</h2>
          <p className="text-muted-foreground">
            Liat insight harian berbasis AI. Cocok buat referensi sebelum entry. Valid banget buat scalper, swinger, atau sniper.
          </p>
        </section>
      </div>
    </main>
  )
}

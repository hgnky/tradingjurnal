import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { UserProvider } from "@/context/user-context"
import "./globals.css"
import { Toaster } from 'sonner'
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "AudenFX",
  description: "SaaS Trading Journal untuk trader forex, crypto, dan saham",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-background text-foreground min-h-screen`}>
        <Toaster />
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}

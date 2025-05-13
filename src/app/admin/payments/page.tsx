"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/context/user-context"
import { supabase } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { toast } from "sonner"

type Payment = {
  id: string
  user_id: string
  plan: string
  amount: number
  bank_name: string
  transfer_date: string
  proof_url: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  user: {
    email: string
    name: string
  }
}

export default function AdminPaymentsPage() {
  const { role, loading, user: admin } = useUser()
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    if (!loading && role !== "admin") window.location.href = "/unauthorized"
  }, [role, loading])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("manual_payments")
        .select("*, user:users(email, name)")
        .order("created_at", { ascending: false })

      setPayments(data || [])
    }

    fetch()
  }, [])

  const handleUpdate = async (id: string, action: "approve" | "reject", plan: string, user_id: string) => {
    if (!admin?.id) return

    const { error } = await supabase
      .from("manual_payments")
      .update({
        status: action,
        reviewed_by: admin.id
      })
      .eq("id", id)

    if (error) return toast.error("Gagal update status")

    if (action === "approve") {
      const roleMap: Record<string, string> = {
        subscriber: "fcea86a5-30a1-48bc-b20d-348aca141d31",
        raider: "b3eb17a9-af21-422c-bd75-3a36a9f6120e"
      }

      await supabase
        .from("users")
        .update({ role_id: roleMap[plan] })
        .eq("id", user_id)
    }

    setPayments(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: action, reviewed_by: admin.id } : p
      )
    )

    toast.success(`Pembayaran ${action === "approve" ? "disetujui" : "ditolak"}`)
  }

  if (loading || role !== "admin") return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Verifikasi Pembayaran Manual</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Bukti</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.user?.email}</div>
                    <div className="text-sm text-muted-foreground">{p.user?.name}</div>
                  </TableCell>
                  <TableCell>{p.plan}</TableCell>
                  <TableCell>{p.bank_name}</TableCell>
                  <TableCell>Rp{p.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <a href={p.proof_url} target="_blank" className="underline text-blue-600">Lihat</a>
                  </TableCell>
                  <TableCell className="capitalize">{p.status}</TableCell>
                  <TableCell className="space-x-2">
                    {p.status === "pending" && (
                      <>
                        <Button variant="success" onClick={() => handleUpdate(p.id, "approved", p.plan, p.user_id)}>Approve</Button>
                        <Button variant="destructive" onClick={() => handleUpdate(p.id, "rejected", p.plan, p.user_id)}>Reject</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

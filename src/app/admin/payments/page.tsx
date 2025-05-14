"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { supabase } from "@/lib/supabase-browser"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type Payment = {
  id: string
  user_id: string
  amount: number
  plan: string
  bank_name: string
  transfer_date: string
  proof_url: string
  status: string
  user: {
    email: string
    name: string
  }
}

export default function AdminPaymentsPage() {
  const { role, loading } = useUser()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/unauthorized")
    }
  }, [role, loading])

  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("manual_payments")
        .select("*, user:users(email, name)")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Failed to fetch payments:", error)
        return
      }

      setPayments(data as Payment[])
    }

    fetchPayments()
  }, [])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const res = await fetch(`/api/admin/payments/manual/${id}/${action}`, {
      method: "PUT"
    })

    if (res.ok) {
      setPayments((prev) => prev.map(p => p.id === id ? { ...p, status: action === "approve" ? "approved" : "rejected" } : p))
    } else {
      console.error("❌ Failed to update status")
    }
  }

  if (loading || role !== "admin") {
    return <div className="p-4">Loading payments...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manual Payments</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Bukti</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.user?.email}</TableCell>
                  <TableCell className="capitalize">{p.plan}</TableCell>
                  <TableCell>{p.bank_name}</TableCell>
                  <TableCell>Rp{p.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <a href={p.proof_url} target="_blank" className="text-blue-600 underline">Lihat</a>
                  </TableCell>
                  <TableCell className="capitalize">{p.status}</TableCell>
                  <TableCell className="space-x-2">
                    {p.status === "pending" && (
                      <>
                        <Button onClick={() => handleAction(p.id, "approve")} variant="success">Approve</Button>
                        <Button onClick={() => handleAction(p.id, "reject")} variant="destructive">Reject</Button>
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

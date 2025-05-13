"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { supabase } from "@/lib/supabase-browser"
import {
  Card, CardHeader, CardTitle, CardContent,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Table, TableHeader, TableBody, TableRow, TableCell,
  Button
} from "@/components/ui"

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
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/unauthorized")
    }
  }, [role, loading])

  useEffect(() => {
    const fetchPayments = async () => {
      let query = supabase
        .from("manual_payments")
        .select("*, user:users(email, name)")
        .order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      if (planFilter !== "all") {
        query = query.eq("plan", planFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error("❌ Failed to fetch payments:", error)
        return
      }

      setPayments(data as Payment[])
    }

    fetchPayments()
  }, [statusFilter, planFilter])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const res = await fetch(`/api/admin/payments/manual/${id}/${action}`, { method: "PUT" })
    if (res.ok) {
      setPayments(prev =>
        prev.map(p =>
          p.id === id ? { ...p, status: action === "approve" ? "approved" : "rejected" } : p
        )
      )
    }
  }

  if (loading || role !== "admin") {
    return <div className="p-4">Loading payments...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manual Payments</h1>

      <div className="flex items-center gap-4">
        <div className="w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Plan</SelectItem>
              <SelectItem value="subscriber">Subscriber</SelectItem>
              <SelectItem value="raider">Raider</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Pembayaran</CardTitle>
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

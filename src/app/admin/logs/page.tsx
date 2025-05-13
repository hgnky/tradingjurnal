"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/context/user-context"
import { supabase } from "@/lib/supabase-browser"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"

type AdminLog = {
  id: string
  action: string
  target_table: string
  target_id: string
  created_at: string
  admin: {
    email: string
    name: string
  }
}

export default function AdminLogsPage() {
  const { role, loading } = useUser()
  const [logs, setLogs] = useState<AdminLog[]>([])

  useEffect(() => {
    if (!loading && role !== "admin") window.location.href = "/unauthorized"
  }, [role, loading])

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("admin_logs")
        .select("*, admin:users(email, name)")
        .order("created_at", { ascending: false })

      setLogs(data || [])
    }

    fetchLogs()
  }, [])

  if (loading || role !== "admin") return <div className="p-6">Memuat data log...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Log Aktivitas Admin</h1>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Aksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Admin</TableCell>
                <TableCell>Aksi</TableCell>
                <TableCell>Tabel Target</TableCell>
                <TableCell>Target ID</TableCell>
                <TableCell>Waktu</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium">{log.admin?.email}</div>
                    <div className="text-sm text-muted-foreground">{log.admin?.name}</div>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.target_table}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.target_id}</TableCell>
                  <TableCell className="text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

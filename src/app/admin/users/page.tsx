"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { supabase } from "@/lib/supabase-browser"

type UserRow = {
  id: string
  email: string
  name: string
  roles: { name: string }
}

export default function AdminUsersPage() {
  const { role, loading } = useUser()
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/unauthorized")
    }
  }, [role, loading])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, roles(name)")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Failed to fetch users:", error)
        return
      }

      setUsers(data as UserRow[])
    }

    fetchUsers()
  }, [])

  if (loading || role !== "admin") {
    return <div className="p-4">Loading users...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell className="capitalize">{u.roles?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

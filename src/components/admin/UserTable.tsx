"use client"

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"

export type UserRow = {
  id: string
  email: string
  name: string
  roles: { name: string }
}

export default function UserTable({ users }: { users: UserRow[] }) {
  return (
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
  )
}

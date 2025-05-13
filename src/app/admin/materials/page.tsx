"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { supabase } from "@/lib/supabase-browser"
import { type Database } from "@/types/supabase"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import EditMaterialDialog from "@/components/admin/EditMaterialDialog"
import { toast } from "sonner"

type Material = Database["public"]["Tables"]["materials"]["Row"]

export default function AdminMaterialsPage() {
  const { role, loading } = useUser()
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [level, setLevel] = useState<"basic" | "premium">("basic")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/unauthorized")
    }
  }, [role, loading])

  const fetchMaterials = async () => {
    const { data } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false })

    setMaterials(data || [])
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  const handleAdd = async () => {
    if (!title || !content) return toast.error("Judul dan Konten wajib diisi")
    setIsSubmitting(true)

    const { data, error } = await supabase
      .from("materials")
      .insert({
        title,
        description,
        content,
        video_url: videoUrl || null,
        pdf_url: pdfUrl || null,
        level,
        category,
      })
      .select()
      .single()

    if (error) {
      toast.error("Gagal menambah materi")
    } else if (data) {
      setMaterials((prev) => [data, ...prev])
      setTitle("")
      setDescription("")
      setContent("")
      setVideoUrl("")
      setPdfUrl("")
      setCategory("")
      setLevel("basic")
      toast.success("Materi berhasil ditambahkan")
    }

    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("materials").delete().eq("id", id)
    if (!error) {
      setMaterials((prev) => prev.filter((m) => m.id !== id))
      toast.success("Materi dihapus")
    } else {
      toast.error("Gagal menghapus materi")
    }
  }

  if (loading || role !== "admin") {
    return <div className="p-4">Loading materials...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Kelola Materi Edukasi</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Materi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul Materi" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi singkat" />
          <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Konten utama / Link Utama" />
          <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Link Video (Opsional)" />
          <Input value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="Link PDF (Opsional)" />
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori / Tag" />
          <Select value={level} onValueChange={(val) => setLevel(val as "basic" | "premium")}>
            <SelectTrigger><SelectValue placeholder="Pilih Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Tambah Materi"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Materi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Judul</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-sm text-muted-foreground">{m.description}</div>
                  </TableCell>
                  <TableCell className="capitalize">{m.level}</TableCell>
                  <TableCell>{m.category}</TableCell>
                  <TableCell className="space-x-2">
                    <EditMaterialDialog material={m} onUpdated={fetchMaterials} />
                    <Button variant="destructive" onClick={() => handleDelete(m.id)}>Hapus</Button>
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

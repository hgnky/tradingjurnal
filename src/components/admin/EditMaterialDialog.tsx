"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase-browser"
import { type Database } from "@/types/supabase"

type Material = Database["public"]["Tables"]["materials"]["Row"]

type Props = {
  material: Material
  onUpdated: () => void
}

export default function EditMaterialDialog({ material, onUpdated }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: material.title,
    description: material.description || "",
    content: material.content,
    video_url: material.video_url || "",
    pdf_url: material.pdf_url || "",
    level: material.level,
    category: material.category || ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setLoading(true)

    const { error } = await supabase
      .from("materials")
      .update({
        title: form.title,
        description: form.description,
        content: form.content,
        video_url: form.video_url,
        pdf_url: form.pdf_url,
        level: form.level,
        category: form.category
      })
      .eq("id", material.id)

    if (error) {
      toast.error("Gagal update materi")
    } else {
      toast.success("Materi berhasil diupdate")
      setOpen(false)
      onUpdated()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Materi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Judul" />
          <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Deskripsi" />
          <Input value={form.content} onChange={(e) => handleChange("content", e.target.value)} placeholder="Konten utama" />
          <Input value={form.video_url} onChange={(e) => handleChange("video_url", e.target.value)} placeholder="URL Video (opsional)" />
          <Input value={form.pdf_url} onChange={(e) => handleChange("pdf_url", e.target.value)} placeholder="URL PDF (opsional)" />
          <Input value={form.category} onChange={(e) => handleChange("category", e.target.value)} placeholder="Kategori / Tag" />
          <Select value={form.level} onValueChange={(val) => handleChange("level", val as "basic" | "premium")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

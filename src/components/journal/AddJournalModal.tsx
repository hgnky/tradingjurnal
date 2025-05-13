'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { JournalForm } from './JournalForm'

export default function AddJournalModal({
  open,
  onClose,
  userId,
  onUpdated,
}: {
  open: boolean
  onClose: () => void
  userId: string
  onUpdated: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
        </DialogHeader>

        <JournalForm userId={userId} onSuccess={onUpdated} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

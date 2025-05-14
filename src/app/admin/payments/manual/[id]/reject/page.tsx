import RejectClient from './client'

export default function RejectPage({ params }: { params: { id: string } }) {
  return <RejectClient id={params.id} />
}

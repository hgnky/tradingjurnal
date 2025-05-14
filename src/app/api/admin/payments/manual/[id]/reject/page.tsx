// src/app/admin/payments/manual/[id]/reject/page.tsx
'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RejectPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // cek role, data payment, dll…
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-4">Loading payments...</div>;
  }

  async function handleReject(reason: string) {
    await fetch(`/api/admin/payments/manual/${params.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    router.push('/admin/payments');
  }

  return (
    <div className="p-4">
      <h1>Reject Payment #{params.id}</h1>
      <button onClick={() => handleReject('Fraudulent')}>Reject</button>
    </div>
  );
}

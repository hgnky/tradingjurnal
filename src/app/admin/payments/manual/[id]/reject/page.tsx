"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RejectPaymentPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  // fetch data logic…
  useEffect(() => {
    // ambil detail payment, cek role, dll
    setLoading(false);
  }, []);
  if (loading) {
    return <div className="p-4">Loading payments...</div>;
  }
  return (
    <div className="p-4">
      {/* UI form untuk reject */}
      <h1>Reject Payment #{params.id}</h1>
      {/* … */}
    </div>
  );
}

// src/app/api/admin/payments/manual/[id]/reject/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Anda bisa menerima detail reason dari body jika diperlukan
  const { reason } = await req.json();

  // Lakukan reject pada record pembayaran
  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected', rejected_reason: reason })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

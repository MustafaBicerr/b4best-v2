import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCloudflareEnv } from '@/lib/cloudflare/env';
import { createContactMessage } from '@/lib/cloudflare/d1';

export const runtime = 'edge';

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  company: z.string().max(100).optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const env = await getCloudflareEnv();
    await createContactMessage(env?.DB ?? null, parsed.data);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/contact]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

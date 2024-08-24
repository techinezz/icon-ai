// src/app/api/getApiUsage/route.ts
import { NextResponse } from 'next/server';
import { getApiUsage } from '@/lib/api-limit';

export async function GET() {
    try {
        const usage = await getApiUsage();
        return NextResponse.json({ usage });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch API usage.' }, { status: 500 });
    }
}

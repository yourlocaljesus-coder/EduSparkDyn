import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { startedAt } = await req.json()

    return NextResponse.json({
      session: {
        id: Math.floor(Math.random() * 10000),
        startedAt,
        status: 'created',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

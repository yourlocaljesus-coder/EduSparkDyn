import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const { endedAt } = await req.json()
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    return NextResponse.json({
      session: {
        id,
        endedAt,
        status: 'success',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 })
  }
}

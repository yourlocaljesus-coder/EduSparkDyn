import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(req: NextRequest) {
  try {
    const { endedAt } = await req.json()
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    const session = await prisma.studySession.update({
      where: { id: Number(id) },
      data: { endedAt: new Date(endedAt) },
    })

    return NextResponse.json({ session })
  } catch (err) {
    console.error('Error ending session:', err)
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 })
  }
}

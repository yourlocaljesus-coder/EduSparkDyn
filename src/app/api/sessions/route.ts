import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { startedAt } = await req.json()

    const session = await prisma.studySession.create({
      data: {
        startedAt: new Date(startedAt),
      },
    })

    return NextResponse.json({ session })
  } catch (err) {
    console.error('Error creating session:', err)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

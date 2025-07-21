import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const sessions = [
      {
        id: 1,
        startedAt: new Date(todayStart.getTime() + 1000 * 60 * 60),
        endedAt: new Date(todayStart.getTime() + 1000 * 60 * 90),
      },
      {
        id: 2,
        startedAt: new Date(todayStart.getTime() + 1000 * 60 * 120),
        endedAt: null,
      },
    ]

    const completedSessions = sessions.filter((s) => s.endedAt !== null)

    const totalSessions = completedSessions.length

    const totalTime = completedSessions.reduce((acc, session) => {
      return (
        acc +
        (new Date(session.endedAt!).getTime() -
          new Date(session.startedAt).getTime())
      )
    }, 0)

    const currentSession = sessions.find((s) => s.endedAt === null)
    const currentDuration = currentSession
      ? Date.now() - new Date(currentSession.startedAt).getTime()
      : 0

    return NextResponse.json({
      totalSessions,
      totalTime,
      currentDuration,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

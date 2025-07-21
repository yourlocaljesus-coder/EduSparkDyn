import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { Session } from '@/session';

// Temporary dummy session data to satisfy the type checker
const sessions: Session[] = [
  {
    id: '1',
    userId: 'u1',
    startedAt: new Date(),
    endedAt: new Date(),
    duration: 1500,
    focusTopic: 'Math',
    wasSuccessful: true
  },
  {
    id: '2',
    userId: 'u1',
    startedAt: new Date(),
    endedAt: null,
    duration: 0,
    focusTopic: 'Science',
    wasSuccessful: false
  }
];

const completedSessions = sessions.filter((s) => s.endedAt !== null);

const notesRef = collection(db, 'notes');

export async function POST(req: Request) {
  const data = await req.json();
  const docRef = await addDoc(notesRef, {
    ...data,
    starred: false,
    createdAt: Date.now()
  });
  return NextResponse.json({ id: docRef.id });
}

export async function GET() {
  const snapshot = await getDocs(notesRef);
  const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(notes);
}

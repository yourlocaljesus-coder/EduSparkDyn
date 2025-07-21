export type Session = {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt: Date | null;
  duration: number; // in seconds
  focusTopic: string;
  wasSuccessful: boolean;
};

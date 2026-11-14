export const runTriggers = ['schedule', 'manual'] as const;
export const runOutcomes = ['running', 'succeeded', 'failed'] as const;

export type RunTrigger = (typeof runTriggers)[number];
export type RunOutcome = (typeof runOutcomes)[number];

/** One run in the history of a task. */
export interface ScheduledTaskRun {
  id: string;
  trigger: RunTrigger;
  requestedBy: string | null;
  claimedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  outcome: RunOutcome;
  message: string | null;
}

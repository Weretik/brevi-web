import type { components } from '@admin/shared/contracts';
import type {
  TaskAssignee,
  TaskDetail,
  TaskEvent,
  TaskEventKind,
  TaskLane,
  TaskLoad,
  TaskOverview,
  TaskPage,
  TaskStatus,
  TaskSummary,
} from '@admin/tasks/model';

type Schemas = components['schemas'];

export const mapTaskSummary = (value: Schemas['TaskSummaryResponse']): TaskSummary => ({
  id: value.id,
  number: value.number,
  title: value.title,
  status: value.status as TaskStatus,
  lane: value.lane as TaskLane,
  isUrgent: value.isUrgent,
  isOverdue: value.isOverdue,
  dueAt: value.dueAt,
  assignee: { userId: value.assignee.userId, name: value.assignee.name },
  customerName: value.customerName ?? null,
  stepsTotal: value.stepsTotal,
  stepsDone: value.stepsDone,
  completedAt: value.completedAt ?? null,
  updatedAt: value.updatedAt,
  version: value.version,
  createdAt: value.createdAt,
});

export const mapTaskPage = (value: Schemas['TaskPageResponse']): TaskPage => ({
  items: value.items.map(mapTaskSummary),
  total: value.total,
});

export const mapTaskBoard = (value: Schemas['TaskBoardResponse']): readonly TaskSummary[] =>
  value.items.map(mapTaskSummary);

const event = (value: Schemas['TaskEventResponse']): TaskEvent => ({
  kind: value.kind as TaskEventKind,
  by: { userId: value.by.userId, name: value.by.name },
  at: value.at,
  details: value.details ?? null,
});

export const mapTaskDetail = (value: Schemas['TaskDetailResponse']): TaskDetail => ({
  ...mapTaskSummary({
    ...value,
    stepsTotal: value.steps.length,
    stepsDone: value.steps.filter((step) => step.isDone).length,
  }),
  description: value.description ?? null,
  author: { userId: value.author.userId, name: value.author.name },
  customerPublicId: value.customerPublicId ?? null,
  leadId: value.leadId ?? null,
  steps: [...value.steps]
    .sort((a, b) => a.position - b.position)
    .map((step) => ({ id: step.id, text: step.text, isDone: step.isDone })),
  history: value.history.map(event),
  createdAt: value.createdAt,
});

const load = (value: Schemas['TaskLoadResponse']): TaskLoad => ({ ...value });

export const mapTaskOverview = (value: Schemas['TaskOverviewResponse']): TaskOverview => ({
  open: value.open,
  overdue: value.overdue,
  urgent: value.urgent,
  new: value.new,
  inProgress: value.inProgress,
  done: value.done,
  doneLastWeek: value.doneLastWeek,
  onTimePercent: value.onTimePercent ?? null,
  load: value.load.map(load),
});

export const mapTaskAssignees = (
  value: Schemas['TaskAssigneeResponse'][],
): readonly TaskAssignee[] =>
  value.map((x) => ({ userId: x.userId, name: x.name, email: x.email ?? null }));

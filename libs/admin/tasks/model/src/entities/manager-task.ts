/** What the manager did. «Прострочено» and «Терміново» are lanes, not statuses (TSK-001 R-05). */
export type TaskStatus = 'New' | 'InProgress' | 'Done';

/** Kanban column: overdue wins over urgent (R-06). */
export type TaskLane = 'Overdue' | 'Urgent' | 'Active' | 'Done';

/** Filter chips of «Завдання менеджерам». */
export type TaskListFilter = 'Open' | 'Overdue' | 'Urgent' | 'New' | 'InProgress' | 'Done';

export type TaskEventKind =
  | 'Created'
  | 'Edited'
  | 'Reassigned'
  | 'DueChanged'
  | 'StatusChanged'
  | 'UrgentChanged'
  | 'StepChecked'
  | 'StepUnchecked';

export interface TaskPerson {
  readonly userId: number;
  readonly name: string;
}

/** A table row or a kanban card. */
export interface TaskSummary {
  readonly id: number;
  readonly number: string;
  readonly title: string;
  readonly status: TaskStatus;
  readonly lane: TaskLane;
  readonly isUrgent: boolean;
  readonly isOverdue: boolean;
  readonly dueAt: string;
  readonly assignee: TaskPerson;
  readonly customerName: string | null;
  readonly stepsTotal: number;
  readonly stepsDone: number;
  readonly completedAt: string | null;
  readonly updatedAt: string;
  readonly version: number;
}

export interface TaskPage {
  readonly items: readonly TaskSummary[];
  readonly total: number;
}

export interface TaskStep {
  readonly id: number;
  readonly text: string;
  readonly isDone: boolean;
}

export interface TaskEvent {
  readonly kind: TaskEventKind;
  readonly by: TaskPerson;
  readonly at: string;
  readonly details: string | null;
}

export interface TaskDetail extends TaskSummary {
  readonly description: string | null;
  readonly author: TaskPerson;
  readonly customerPublicId: string | null;
  readonly steps: readonly TaskStep[];
  readonly history: readonly TaskEvent[];
  readonly createdAt: string;
}

/** Workload of one manager («Навантаження» tab). */
export interface TaskLoad {
  readonly userId: number;
  readonly name: string;
  readonly open: number;
  readonly overdue: number;
  readonly urgent: number;
  readonly inProgress: number;
  /** Done in the last 7 days. */
  readonly doneLastWeek: number;
  /** Share done by the due time in the last 30 days; null when nothing was done. */
  readonly onTimePercent: number | null;
}

export interface TaskOverview {
  readonly open: number;
  readonly overdue: number;
  readonly urgent: number;
  readonly new: number;
  readonly inProgress: number;
  readonly done: number;
  readonly doneLastWeek: number;
  readonly onTimePercent: number | null;
  readonly load: readonly TaskLoad[];
}

export interface TaskAssignee {
  readonly userId: number;
  readonly name: string;
  readonly email: string | null;
}

/** The signed-in staff member: Director and Admin manage every task (R-01, R-02). */
export interface TaskViewer {
  readonly userId: number | null;
  readonly isAdmin: boolean;
}

export interface TaskListQuery {
  readonly search: string;
  readonly filter: TaskListFilter;
  readonly assigneeUserId: number | null;
  readonly page: number;
  readonly pageSize: number;
}

/** A Crm client the task points to. */
export interface TaskCustomerOption {
  readonly publicId: string;
  readonly name: string;
}

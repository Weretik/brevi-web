/** One changed field as the backend wrote it: display values, null when empty. */
export interface ActivityChange {
  field: string;
  from: string | null;
  to: string | null;
}

/** One staff action in «Журнал дій» (BreviERP ACT-001). */
export interface ActivityEntry {
  id: string;
  occurredAt: string;
  actorId: number;
  actorName: string;
  actorRoles: string[];
  action: string;
  subjectType: string;
  subjectTypeTitle: string;
  subjectId: string;
  subjectTitle: string;
  summary: string | null;
  changes: ActivityChange[];
}

export interface ActivityEntriesPage {
  items: ActivityEntry[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ActivityActorOption {
  id: number;
  name: string;
}

export interface ActivitySubjectTypeOption {
  key: string;
  title: string;
}

/** What the filters can offer: the people, object types and actions present in the log. */
export interface ActivityFilterOptions {
  actors: ActivityActorOption[];
  subjectTypes: ActivitySubjectTypeOption[];
  actions: string[];
}

/** The request of one page of entries; an absent value does not filter. */
export interface ActivityQuery {
  page: number;
  pageSize: number;
  actorId?: number;
  role?: string;
  subjectType?: string;
  action?: string;
  from?: string;
  to?: string;
  search?: string;
}

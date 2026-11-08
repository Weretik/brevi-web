export type LeadStage = 'New' | 'InWork' | 'Talking' | 'Offer' | 'Client' | 'Closed';
export type LeadOutcome = 'Retry' | 'Callback' | 'Talking' | 'Offer' | 'Client' | 'Closed';
export type LeadScope = 'All' | 'Mine' | 'Free';

export interface LeadPerson {
  readonly userId: number;
  readonly name: string;
}

/** A row of «Усі ліди» and of the «Мій день» queue. */
export interface LeadSummary {
  readonly id: number;
  readonly sourceId: number;
  readonly company: string;
  readonly category: string | null;
  readonly region: string | null;
  readonly industry: string | null;
  readonly callReason: string | null;
  readonly stage: LeadStage;
  readonly owner: LeadPerson | null;
  readonly lastResultName: string | null;
  readonly lastCallAt: string | null;
  readonly nextContactAt: string | null;
  readonly isOverdue: boolean;
  readonly callCount: number;
  readonly addedOn: string | null;
  readonly inSheet: boolean;
  readonly version: number;
}

export interface LeadPage {
  readonly items: readonly LeadSummary[];
  readonly total: number;
  readonly mine: number;
  readonly free: number;
  readonly all: number;
}

export interface LeadCall {
  readonly id: number;
  readonly by: LeadPerson;
  readonly at: string;
  readonly resultName: string;
  readonly outcome: LeadOutcome;
  readonly comment: string | null;
  readonly nextContactAt: string | null;
}

export interface LeadDetail extends LeadSummary {
  readonly categoryDescription: string | null;
  readonly scale: string | null;
  readonly signal: string | null;
  readonly signalDate: string | null;
  readonly factOrPlan: string | null;
  readonly signalUrl: string | null;
  readonly volumeReason: string | null;
  readonly offer: string | null;
  readonly website: string | null;
  readonly contacts: string | null;
  readonly whomToCall: string | null;
  readonly tenderCheck: string | null;
  readonly reliability: string | null;
  readonly email: string | null;
  readonly sheetNotes: string | null;
  readonly takenAt: string | null;
  readonly openTaskId: number | null;
  readonly calls: readonly LeadCall[];
}

export interface LeadMyDay {
  readonly queue: readonly LeadSummary[];
  readonly later: readonly LeadSummary[];
  readonly callsToday: number;
  readonly plannedToday: number;
  readonly free: number;
}

export interface LeadCallResult {
  readonly id: number;
  readonly name: string;
  readonly outcome: LeadOutcome;
  readonly retryDays: number | null;
  readonly isActive: boolean;
  readonly position: number;
}

export interface LeadCategory {
  readonly code: string;
  readonly description: string | null;
  readonly leads: number;
}

export interface LeadListQuery {
  readonly search: string;
  readonly scope: LeadScope;
  readonly category: string | null;
  readonly page: number;
  readonly pageSize: number;
}

export interface LeadSyncResult {
  readonly rows: number;
  readonly added: number;
  readonly updated: number;
  readonly gone: number;
  readonly skipped: number;
  /** Rows left out because their company is already on an earlier row (rows match by company name). */
  readonly duplicates: number;
  /** Free leads taken for the manager named in «Кто взял в работу». */
  readonly assigned: number;
  /** Calls brought into the history from «Результат звонка» of the sheet. */
  readonly calls: number;
  readonly warning: string | null;
}

export interface LeadSyncState {
  readonly lastRunAt: string | null;
  readonly lastSuccessAt: string | null;
  readonly rows: number;
  readonly error: string | null;
  /** What the last successful run left out, such as a company written twice. */
  readonly warning: string | null;
}

export interface LeadManagerStats {
  readonly manager: LeadPerson;
  readonly inWork: number;
  readonly calls: number;
  readonly reachedPercent: number | null;
  readonly offers: number;
  readonly clients: number;
  readonly overdue: number;
}

export interface LeadCount {
  readonly name: string;
  readonly count: number;
}

export interface LeadIndustryStats {
  readonly industry: string;
  readonly categories: readonly LeadCount[];
  readonly total: number;
}

export interface LeadStats {
  readonly from: string;
  readonly to: string;
  readonly total: number;
  readonly free: number;
  readonly inWork: number;
  readonly offer: number;
  readonly clients: number;
  readonly closed: number;
  readonly overdue: number;
  readonly callsInPeriod: number;
  readonly addedInPeriod: number;
  readonly managers: readonly LeadManagerStats[];
  readonly results: readonly LeadCount[];
  readonly industries: readonly LeadIndustryStats[];
  readonly categories: readonly string[];
  readonly sync: LeadSyncState | null;
}

/** The signed-in person on «Ліди»: edit = take and call; Director/Admin may give back anybody's lead. */
export interface LeadViewer {
  readonly userId: number | null;
  readonly isAdmin: boolean;
  readonly canEdit: boolean;
}

/** The signed-in person on «Адміністрування › Ліди». */
export interface LeadStatsViewer {
  readonly canEdit: boolean;
  readonly canSync: boolean;
}

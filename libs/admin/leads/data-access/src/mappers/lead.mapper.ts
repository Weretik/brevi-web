import type {
  LeadCall,
  LeadCallResult,
  LeadCategory,
  LeadDetail,
  LeadMyDay,
  LeadPage,
  LeadPerson,
  LeadStats,
  LeadSummary,
  LeadSyncResult,
} from '@admin/leads/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const person = (value: Schemas['CrmLeadPerson']): LeadPerson => ({
  userId: value.userId,
  name: value.name,
});

export const mapLeadSummary = (value: Schemas['CrmLeadSummary']): LeadSummary => ({
  id: value.id,
  sourceId: value.sourceId,
  company: value.company,
  category: value.category ?? null,
  region: value.region ?? null,
  industry: value.industry ?? null,
  callReason: value.callReason ?? null,
  stage: value.stage,
  owner: value.owner ? person(value.owner) : null,
  lastResultName: value.lastResultName ?? null,
  lastCallAt: value.lastCallAt ?? null,
  nextContactAt: value.nextContactAt ?? null,
  isOverdue: value.isOverdue,
  callCount: value.callCount,
  addedOn: value.addedOn ?? null,
  inSheet: value.inSheet,
  version: value.version,
});

export const mapLeadPage = (value: Schemas['CrmLeadPage']): LeadPage => ({
  items: value.items.map(mapLeadSummary),
  total: value.total,
  mine: value.mine,
  free: value.free,
  all: value.all,
});

export const mapLeadMyDay = (value: Schemas['CrmLeadMyDay']): LeadMyDay => ({
  queue: value.queue.map(mapLeadSummary),
  later: value.later.map(mapLeadSummary),
  callsToday: value.callsToday,
  plannedToday: value.plannedToday,
  free: value.free,
});

const call = (value: Schemas['CrmLeadCall']): LeadCall => ({
  id: value.id,
  by: person(value.by),
  at: value.at,
  resultName: value.resultName,
  outcome: value.outcome,
  comment: value.comment ?? null,
  nextContactAt: value.nextContactAt ?? null,
});

export const mapLeadDetail = (value: Schemas['CrmLead']): LeadDetail => ({
  ...mapLeadSummary(value),
  categoryDescription: value.categoryDescription ?? null,
  scale: value.scale ?? null,
  signal: value.signal ?? null,
  signalDate: value.signalDate ?? null,
  factOrPlan: value.factOrPlan ?? null,
  signalUrl: value.signalUrl ?? null,
  volumeReason: value.volumeReason ?? null,
  offer: value.offer ?? null,
  website: value.website ?? null,
  contacts: value.contacts ?? null,
  whomToCall: value.whomToCall ?? null,
  tenderCheck: value.tenderCheck ?? null,
  reliability: value.reliability ?? null,
  email: value.email ?? null,
  sheetNotes: value.sheetNotes ?? null,
  takenAt: value.takenAt ?? null,
  openTaskId: value.openTaskId ?? null,
  calls: value.calls.map(call),
});

export const mapLeadCallResult = (value: Schemas['CrmLeadCallResult']): LeadCallResult => ({
  id: value.id,
  name: value.name,
  outcome: value.outcome,
  retryDays: value.retryDays ?? null,
  isActive: value.isActive,
  position: value.position,
});

export const mapLeadCallResults = (
  value: Schemas['CrmLeadCallResult'][],
): readonly LeadCallResult[] =>
  [...value].sort((a, b) => a.position - b.position || a.id - b.id).map(mapLeadCallResult);

export const mapLeadCategory = (value: Schemas['CrmLeadCategory']): LeadCategory => ({
  code: value.code,
  description: value.description ?? null,
  leads: value.leads,
});

export const mapLeadCategories = (value: Schemas['CrmLeadCategory'][]): readonly LeadCategory[] =>
  value.map(mapLeadCategory);

export const mapLeadStats = (value: Schemas['CrmLeadStats']): LeadStats => ({
  from: value.from,
  to: value.to,
  total: value.total,
  free: value.free,
  inWork: value.inWork,
  offer: value.offer,
  clients: value.clients,
  closed: value.closed,
  overdue: value.overdue,
  callsInPeriod: value.callsInPeriod,
  addedInPeriod: value.addedInPeriod,
  managers: value.managers.map((x) => ({
    manager: person(x.manager),
    inWork: x.inWork,
    calls: x.calls,
    reachedPercent: x.reachedPercent ?? null,
    offers: x.offers,
    clients: x.clients,
    overdue: x.overdue,
  })),
  results: value.results.map((x) => ({ name: x.name, count: x.count })),
  industries: value.industries.map((x) => ({
    industry: x.industry,
    categories: x.categories.map((c) => ({ name: c.name, count: c.count })),
    total: x.total,
  })),
  categories: [...value.categories],
  sync: value.sync
    ? {
        lastRunAt: value.sync.lastRunAt ?? null,
        lastSuccessAt: value.sync.lastSuccessAt ?? null,
        rows: value.sync.rows,
        error: value.sync.error ?? null,
        warning: value.sync.warning ?? null,
      }
    : null,
});

export const mapLeadSync = (value: Schemas['CrmLeadSync']): LeadSyncResult => ({
  rows: value.rows,
  added: value.added,
  updated: value.updated,
  gone: value.gone,
  skipped: value.skipped,
  duplicates: value.duplicates,
  warning: value.warning ?? null,
});

import {
  sewingCreateCheckLabels,
  sewingShiftMinutes,
} from '../../entities/sewing-create/sewing-create-step';
import { sewingBlockerReasons } from '../sewing-card/sewing-blocker-reasons';

import type { SewingArticleSummaryRow } from '../../entities/sewing-card/sewing-article-summary';
import type { SewingOperationDraft } from '../../entities/sewing-composition/sewing-operation-draft';
import type {
  SewingCreateCheck,
  SewingCreateCheckKey,
  SewingCreateCheckState,
  SewingCreateStep,
} from '../../entities/sewing-create/sewing-create-step';

export interface SewingCreateRoute {
  /** The saved draft; null before step 1 creates it. */
  productId: number | null;
  step: SewingCreateStep;
}

/** `?id=&step=` of the wizard: without a draft only step 1 exists; with one the default is step 2. */
export function parseSewingCreateRoute(id: string | null, step: string | null): SewingCreateRoute {
  const productId = id && /^\d+$/.test(id) && Number(id) > 0 ? Number(id) : null;
  if (productId === null) return { productId, step: 1 };
  const value = Number(step);
  return {
    productId,
    step: Number.isInteger(value) && value >= 1 && value <= 5 ? (value as SewingCreateStep) : 2,
  };
}

/** Steps 2–5 need the saved draft. */
export function canOpenSewingCreateStep(step: SewingCreateStep, hasDraft: boolean): boolean {
  return step === 1 || hasDraft;
}

const materialReasons = ['Немає тканини'];
const compositionReasons = ['Неповна комплектація', 'Комплектацію не перевірено'];
const labourReasons = ['Немає трудовитрат', 'Немає часу операції'];
const reviewReasons = ['Операції не підтверджено'];

interface ChecklistInput {
  /** Live Article summary; null while it is not loaded. */
  articles: readonly SewingArticleSummaryRow[] | null;
  /** Current shared operations of the composition draft; null while not loaded. */
  operations: readonly SewingOperationDraft[] | null;
}

/**
 * «Що заважає розрахунку»: the sheet's readiness reasons. Article reasons come from the live
 * summary; labour reasons from the current operations when they are loaded.
 */
export function sewingCreateChecklist({
  articles,
  operations,
}: ChecklistInput): SewingCreateCheck[] {
  const reasons = new Set(articles?.flatMap((row) => sewingBlockerReasons(row.blockers)) ?? []);
  const fromSummary = (list: string[]): SewingCreateCheckState =>
    !articles?.length ? 'unknown' : list.some((reason) => reasons.has(reason)) ? 'blocking' : 'ok';
  const labour: SewingCreateCheckState = operations
    ? operations.length
      ? 'ok'
      : 'blocking'
    : fromSummary(labourReasons);
  const reviewed: SewingCreateCheckState = operations
    ? operations.length && operations.every((operation) => operation.reviewed)
      ? 'ok'
      : 'blocking'
    : fromSummary(reviewReasons);
  const states: Record<SewingCreateCheckKey, SewingCreateCheckState> = {
    article: articles === null ? 'unknown' : articles.length ? 'ok' : 'blocking',
    materials: fromSummary(materialReasons),
    composition: fromSummary(compositionReasons),
    labour,
    reviewed,
  };
  return (Object.keys(sewingCreateCheckLabels) as SewingCreateCheckKey[]).map((key) => ({
    key,
    label: sewingCreateCheckLabels[key],
    state: states[key],
  }));
}

/** «Готово до розрахунку»: every Article of the model has a live price. */
export function isSewingCreateReady(articles: readonly SewingArticleSummaryRow[] | null): boolean {
  return Boolean(articles?.length && articles.every((row) => row.calculated));
}

interface DoneInput {
  hasDraft: boolean;
  checks: readonly SewingCreateCheck[];
  active: boolean;
}

/** Steps shown as done in the stepper. */
export function sewingCreateDoneSteps({ hasDraft, checks, active }: DoneInput): SewingCreateStep[] {
  if (!hasDraft) return [];
  const ok = (...keys: SewingCreateCheckKey[]) =>
    keys.every((key) => checks.find((check) => check.key === key)?.state === 'ok');
  const done: SewingCreateStep[] = [1];
  if (ok('article')) done.push(2);
  if (ok('article', 'materials', 'composition')) done.push(3);
  if (ok('labour', 'reviewed')) done.push(4);
  if (active) done.push(5);
  return done;
}

export interface SewingCreateLabour {
  minutes: number;
  piecesPerShift: number;
}

/** «Трудовитрати»: minutes per product and whole pieces per shift; null without labour. */
export function sewingCreateLabour(minutes: number): SewingCreateLabour | null {
  if (!(minutes > 0)) return null;
  return { minutes, piecesPerShift: Math.floor(sewingShiftMinutes / minutes) };
}

export const auditActions = [
  'Create',
  'Update',
  'Archive',
  'Restore',
  'Delete',
  'CutoverConfirm',
  'CutoverReset',
  'Void',
  'Deactivate',
  'Verify',
  'Merge',
  'Review',
  'Promote',
  'AttachmentAdd',
  'AttachmentDelete',
] as const;
export type AuditAction = (typeof auditActions)[number];

export const auditEntities = [
  'Account',
  'Category',
  'Transaction',
  'Transfer',
  'Counterparty',
] as const;
export type AuditEntity = (typeof auditEntities)[number];

export const auditActionLabels: Record<AuditAction, string> = {
  Create: 'Створено',
  Update: 'Змінено',
  Archive: 'Архівовано',
  Restore: 'Відновлено',
  Delete: 'Видалено',
  CutoverConfirm: 'Підтверджено залишок на 01.10',
  CutoverReset: 'Скасовано залишок на 01.10',
  Void: 'Анульовано',
  Deactivate: 'Вимкнено, бо вже використана',
  Verify: 'Підтверджено',
  Merge: 'Обʼєднано',
  Review: 'Перевірено',
  Promote: 'Разового зроблено постійним',
  AttachmentAdd: 'Додано файл',
  AttachmentDelete: 'Видалено файл',
};

/** One change of a record; snapshots are the JSON text before and after. */
export interface FinanceHistoryEntry {
  id: number;
  entity: AuditEntity;
  entityId: string;
  action: AuditAction;
  by: string;
  at: string;
  beforeJson: string | null;
  afterJson: string | null;
}

/** The file name an «Додано файл» or «Видалено файл» entry is about, or null. */
export function historyFileName(entry: FinanceHistoryEntry): string | null {
  if (entry.action !== 'AttachmentAdd' && entry.action !== 'AttachmentDelete') return null;
  try {
    const snapshot: unknown = JSON.parse(entry.afterJson ?? entry.beforeJson ?? 'null');
    const name = (snapshot as { fileName?: unknown } | null)?.fileName;
    return typeof name === 'string' ? name : null;
  } catch {
    return null;
  }
}

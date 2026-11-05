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
] as const;
export type AuditAction = (typeof auditActions)[number];

export const auditEntities = ['Account', 'Category', 'Transaction', 'Transfer'] as const;
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

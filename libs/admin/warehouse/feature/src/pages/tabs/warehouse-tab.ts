import type { WarehouseAccess } from '@admin/warehouse/model';
import type { ReactNode } from 'react';

/** A page shown as a tab of «Що замовити» or «Звіти»: the shared title and the tab row under its header. */
export interface WarehouseTabProps {
  title?: string;
  tabs?: ReactNode;
  /** The person's «Склад тканин» pages, for actions that lead to another page (e.g. «Прихід»). */
  access?: WarehouseAccess;
}

export interface Supplier {
  id: number;
  name: string;
  link: string | null;
  contactPerson: string | null;
  phoneNumber: string | null;
  email: string | null;
  /** «Що закуповуємо»; from KeepinCRM for a linked supplier. */
  purchaseCategories: string | null;
  /** KeepinCRM tags, read-only. */
  tags: string | null;
  /** «Використовувати в проєкті». */
  isActive: boolean;
  notes: string | null;
  /** When set, the card comes from KeepinCRM; Brevi edits only activity and notes. */
  keepinCrmId: string | null;
  keepinSyncedAt: string | null;
}

/** Result of «Оновити з KeepinCRM». */
export interface SupplierKeepinSyncResult {
  received: number;
  created: number;
  linked: number;
  updated: number;
  missingInKeepinCrm: string[];
  syncedAt: string;
}

export interface SupplierDraft {
  id: number;
  name: string;
  link: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  purchaseCategories: string;
  isActive: boolean;
  notes: string;
}

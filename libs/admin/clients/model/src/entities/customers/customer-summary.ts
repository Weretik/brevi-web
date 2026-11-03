export interface CustomerSummary {
  readonly publicId: string;
  readonly kind: 'organization' | 'person';
  readonly displayName: string;
  readonly legalName: string | null;
  readonly taxIdentity: string | null;
  readonly ownerId: number;
  readonly active: boolean;
  readonly revision: number;
  readonly updatedAt: string;
  /** KeepinCRM client ID; null for a client created in Brevi. */
  readonly keepinCrmId: string | null;
  /** Active contact, the primary one first (list only). */
  readonly contactName: string | null;
  /** Phones of the active contacts (list only). */
  readonly phones: readonly string[];
}

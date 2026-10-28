export interface MergeCustomersIntent {
  customerId: string;
  victimId: string;
  revision: number;
  victimRevision: number;
  reason: string;
  requestId: string;
}

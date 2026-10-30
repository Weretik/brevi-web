export interface QuoteListQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly state?: 'draft' | 'ready' | 'sent';
  readonly archived?: boolean;
  readonly ownerId?: number;
  readonly createdFrom?: string;
  readonly createdBefore?: string;
  readonly sourceQuoteId?: string;
}

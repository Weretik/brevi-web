export type QuoteLifecycleIntent = {
  readonly quoteId: string;
  readonly revision: number;
} & (
  | { readonly action: 'copy'; readonly versionId: string }
  | { readonly action: 'transfer'; readonly ownerId: number; readonly reason: string }
  | { readonly action: 'archive'; readonly archived: boolean; readonly reason: string }
  | {
      readonly action: 'reprice';
      readonly versionId: string;
      readonly bases: readonly { readonly variantId: string; readonly basisToken: string }[];
    }
);

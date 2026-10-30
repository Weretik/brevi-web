export type QuotePriceSelection =
  | { readonly kind: 'customSewing'; readonly versionId: string; readonly draftId?: string }
  | { readonly kind: 'sewing'; readonly productId: number; readonly articleId: number }
  | {
      readonly kind: 'ppe';
      readonly productId: number;
      readonly override?: {
        readonly tier: 'retail' | 'wholesale' | 'largeWholesale';
        readonly amount: number;
        readonly reason: string;
      };
    }
  | {
      readonly kind: 'oneOffPpe';
      readonly prices: {
        readonly retail: number;
        readonly wholesale: number;
        readonly largeWholesale: number;
        readonly reason: string;
      };
    };

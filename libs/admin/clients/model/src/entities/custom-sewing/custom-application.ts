export interface CustomApplication {
  readonly kind: 'embroidery' | 'print';
  readonly location: string;
  readonly artworkFileId: string | null;
  readonly cost: number;
  readonly saleAmount: number;
  readonly saleApproved: boolean;
}

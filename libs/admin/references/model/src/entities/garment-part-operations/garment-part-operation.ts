export interface GarmentPartOperation {
  id: number;
  /** Calculator sheet ID (OP-001…); unique when set. */
  code: string | null;
  /** «Група деталей». */
  garmentPartName: string;
  /** «Вузол / елемент». */
  element: string | null;
  /** «Варіант виконання». */
  variant: string | null;
  name: string;
  /** Norm in minutes; 0 when `minutesPerProduct`. */
  min: number;
  /** No fixed norm: the time is entered per product (OP-155 «Нестандартна операція»). */
  minutesPerProduct: boolean;
  /** ISO date of the last norm check. */
  isActive: boolean;
  notes: string | null;
}

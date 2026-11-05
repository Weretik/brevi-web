import { useGetProductAccessQuery } from '@admin/products/data-access';

/** Cost price and supplier price are for Admin only; the Director also holds Admin (CAT-019). */
export function useCanSeeCost() {
  const access = useGetProductAccessQuery();
  return access.currentData?.canSeeCost === true;
}

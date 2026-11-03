import { useGetProductCodeCheckQuery } from '@admin/products/data-access';

import { useDebouncedValue } from './use-debounced-value';

import type { PpeCodeCheckState } from '@admin/products/model';

/** Asks Brevi whether a PPE site code is free, after the user stops typing. */
export function usePpeCodeCheck(code: string): {
  state: PpeCodeCheckState;
  takenByName: string | null;
} {
  const typed = code.trim();
  const asked = useDebouncedValue(typed);
  const check = useGetProductCodeCheckQuery({ type: 'Ppe', code: asked }, { skip: !asked });
  if (!typed) return { state: 'idle', takenByName: null };
  if (asked !== typed || check.isFetching || check.isLoading)
    return { state: 'checking', takenByName: null };
  if (check.isError || !check.currentData) return { state: 'unknown', takenByName: null };
  if (check.currentData.isAvailable === false)
    return { state: 'taken', takenByName: check.currentData.takenByProductName };
  return { state: check.currentData.isAvailable ? 'available' : 'unknown', takenByName: null };
}

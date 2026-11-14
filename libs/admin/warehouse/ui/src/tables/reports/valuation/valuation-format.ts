import { formatMoney } from '@admin/warehouse/model';

export const price = (value: number | null) => (value === null ? '—' : `${formatMoney(value)}/м`);

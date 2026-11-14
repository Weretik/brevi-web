import { Link, Typography } from '@mui/material';

/** Cell of a КП or fabric price the report could not find. */
export const unknownPrice = (
  <Typography component="span" variant="body2" color="warning.main">
    ціна невідома
  </Typography>
);

/** Minutes of «Робочий час» as hours, e.g. «1,5». */
export const hoursCell = (minutes: number) =>
  (minutes / 60).toLocaleString('uk-UA', { maximumFractionDigits: 2 });

/** Link to the order, or a dash when the row has none. */
export const orderCell = (id: number | null, number: number | null) =>
  id === null || number === null ? '—' : <Link href={`/production/orders/${id}`}>№{number}</Link>;

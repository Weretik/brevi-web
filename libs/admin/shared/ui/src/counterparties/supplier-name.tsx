import { Link } from '@mui/material';

import { useOpenSupplierCard } from './supplier-card-context';

interface Props {
  name: string | null | undefined;
  id?: number | null;
  /** Shown for an empty name; «—» by default. */
  empty?: string;
}

/**
 * A supplier name anywhere in the admin (CARD-001): a link that opens the supplier panel, or plain
 * text where the app gives no panel. The click does not reach the row under it.
 */
export function SupplierName({ name, id, empty = '—' }: Props) {
  const open = useOpenSupplierCard();
  const text = name?.trim();
  if (!text) return <>{empty}</>;
  if (!open) return <>{text}</>;
  return (
    <Link
      component="button"
      type="button"
      underline="hover"
      aria-label={`Постачальник: ${text}`}
      onClick={(event) => {
        event.stopPropagation();
        open({ id, name: text });
      }}
      sx={{
        color: 'primary.dark',
        font: 'inherit',
        textAlign: 'left',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
      }}
    >
      {text}
    </Link>
  );
}

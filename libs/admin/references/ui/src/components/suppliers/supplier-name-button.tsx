import { Link } from '@mui/material';

interface Props {
  name: string | null;
  onOpen: (name: string) => void;
  tabIndex?: number;
}

/** A supplier name that opens the supplier's card (CAT-019); an empty name shows «—». */
export function SupplierNameButton({ name, onOpen, tabIndex }: Props) {
  if (!name?.trim()) return <>—</>;
  return (
    <Link
      component="button"
      type="button"
      tabIndex={tabIndex}
      underline="hover"
      aria-label={`Постачальник: ${name}`}
      onClick={(event) => {
        event.stopPropagation();
        onOpen(name);
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
      {name}
    </Link>
  );
}

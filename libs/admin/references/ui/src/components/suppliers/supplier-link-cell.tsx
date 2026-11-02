import { supplierLinkHref } from '@admin/references/model';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Link } from '@mui/material';

interface Props {
  value: string | null;
  tabIndex: number;
}

export function SupplierLinkCell({ value, tabIndex }: Props) {
  const href = supplierLinkHref(value);
  return href ? (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabIndex}
      onClick={(event) => event.stopPropagation()}
      underline="hover"
      sx={{
        color: 'primary.dark',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        maxWidth: '100%',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
      <OpenInNewOutlinedIcon sx={{ fontSize: 'inherit', flexShrink: 0 }} />
    </Link>
  ) : (
    value || '—'
  );
}

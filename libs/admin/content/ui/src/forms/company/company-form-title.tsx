import { Typography } from '@mui/material';

/** Heading of a part of the company form. */
export function CompanyFormTitle({ children }: { children: string }) {
  return (
    <Typography variant="subtitle2" sx={{ mt: 1 }}>
      {children}
    </Typography>
  );
}

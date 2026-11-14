import { Card, CardContent } from '@mui/material';

import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  label: string;
  fullWidth?: boolean;
}

export function ProductFormSection({ children, fullWidth = false, label }: Props) {
  return (
    <Card
      component="section"
      aria-label={label}
      variant="outlined"
      sx={{
        bgcolor: 'common.white',
        color: 'common.black',
        gridColumn: fullWidth ? '1 / -1' : undefined,
        minWidth: 0,
        '& .MuiInputBase-root': { color: 'common.black' },
        '& .MuiFormLabel-root, & .MuiFormHelperText-root': { color: 'grey.700' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>{children}</CardContent>
    </Card>
  );
}

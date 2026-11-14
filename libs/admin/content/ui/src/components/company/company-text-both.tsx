import { Typography } from '@mui/material';

import type { CompanyText } from '@admin/content/model';

export function CompanyTextBoth({ text }: { text: CompanyText }) {
  return (
    <>
      {text.uk}
      {text.ru !== text.uk && (
        <Typography variant="caption" color="text.secondary" component="div">
          рос.: {text.ru}
        </Typography>
      )}
    </>
  );
}

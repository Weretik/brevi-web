import { managerPhotoSrc } from '@admin/content/model';
import { Avatar, Stack, Typography } from '@mui/material';

import { mono } from './site-company-styles';

import type { CompanyManager } from '@admin/content/model';

export function SiteCompanyManagerTile({ manager }: { manager: CompanyManager }) {
  return (
    <Stack
      direction="row"
      sx={{
        gap: 1.5,
        alignItems: 'flex-start',
        p: 1.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        minWidth: 0,
      }}
    >
      <Avatar
        src={managerPhotoSrc(manager.photoUrl)}
        alt={manager.name.uk}
        sx={{ width: 56, height: 56 }}
      >
        {manager.name.uk.slice(0, 1)}
      </Avatar>
      <Stack sx={{ minWidth: 0, gap: 0.25 }}>
        <Typography variant="subtitle2">{manager.name.uk}</Typography>
        {manager.name.ru !== manager.name.uk && (
          <Typography variant="caption" color="text.secondary">
            рос.: {manager.name.ru}
          </Typography>
        )}
        {manager.phones.map((phone) => (
          <Typography key={phone} variant="body2" sx={mono}>
            {phone}
          </Typography>
        ))}
        {manager.email && (
          <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
            {manager.email}
          </Typography>
        )}
        {manager.photoUrl && !managerPhotoSrc(manager.photoUrl) && (
          <Typography variant="caption" color="text.secondary">
            Фото з сайту; щоб змінити, оберіть нове з «Фото».
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

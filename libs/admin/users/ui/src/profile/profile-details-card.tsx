import { canChangeOwnCredentials, staffRoleLabels } from '@admin/users/model';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';

import { ProfileSection } from './profile-section';

import type { StaffProfile } from '@admin/users/model';

export type ProfileField = 'name' | 'phone' | 'email' | 'password';

interface ProfileDetailsCardProps {
  profile: StaffProfile;
  onEdit: (field: ProfileField) => void;
}

interface DetailRow {
  label: string;
  value: string;
  field?: ProfileField;
}

/**
 * Name, phone, email, role and password. Everyone changes the name; only the director and
 * administrators change their phone, email and password.
 */
export function ProfileDetailsCard({ onEdit, profile }: ProfileDetailsCardProps) {
  const canEditCredentials = canChangeOwnCredentials(profile);
  const rows: DetailRow[] = [
    { label: 'Імʼя', value: profile.fullName || '—', field: 'name' },
    {
      label: 'Телефон',
      value: profile.phoneNumber ?? '—',
      field: canEditCredentials ? 'phone' : undefined,
    },
    {
      label: 'Email (логін)',
      value: profile.email,
      field: canEditCredentials ? 'email' : undefined,
    },
    { label: 'Роль', value: staffRoleLabels[profile.role] },
    ...(canEditCredentials
      ? [{ label: 'Пароль', value: '••••••••', field: 'password' as const }]
      : []),
  ];

  return (
    <ProfileSection title="Особисті дані">
      <Stack divider={<Divider flexItem />} spacing={1.5}>
        {rows.map((row) => (
          <Fragment key={row.label}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography color="text.secondary" variant="caption">
                  {row.label}
                </Typography>
                <Typography sx={{ overflowWrap: 'anywhere' }}>{row.value}</Typography>
              </Box>
              {row.field ? (
                <Button
                  aria-label={`Змінити: ${row.label}`}
                  onClick={() => row.field && onEdit(row.field)}
                  size="small"
                >
                  Змінити
                </Button>
              ) : null}
            </Stack>
          </Fragment>
        ))}
      </Stack>
      {canEditCredentials ? null : (
        <Typography color="text.secondary" variant="body2">
          Телефон, email і пароль змінює адміністратор або директор.
        </Typography>
      )}
    </ProfileSection>
  );
}

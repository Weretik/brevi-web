import { FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from '../staff/staff-side-panel';

import type { AccessRole } from '@admin/users/model';

interface CopyRolePanelProps {
  open: boolean;
  /** The role that receives the rights. */
  targetTitle: string;
  /** Roles to copy from, without the target. */
  sources: readonly AccessRole[];
  onClose: () => void;
  onCopy: (roleName: string) => void;
}

/**
 * «Копіювати з ролі…»: puts another role's rights into the switches of this one. Nothing is saved until «Зберегти»,
 * so the copy can be adjusted or dropped.
 */
export function CopyRolePanel({ onClose, onCopy, open, sources, targetTitle }: CopyRolePanelProps) {
  const [source, setSource] = useState('');

  const close = () => {
    setSource('');
    onClose();
  };

  return (
    <StaffSidePanel
      description={`Права вибраної ролі замінять позначки ролі «${targetTitle}». Збережіть, щоб застосувати.`}
      onClose={close}
      onSubmit={(event) => {
        event.preventDefault();
        if (!source) return;
        onCopy(source);
        close();
      }}
      open={open}
      submitLabel="Копіювати"
      submitting={false}
      title="Копіювати з ролі"
    >
      <Stack spacing={1}>
        <Typography id="copy-role-source" variant="subtitle2">
          З якої ролі
        </Typography>
        <RadioGroup
          aria-labelledby="copy-role-source"
          onChange={(event) => setSource(event.target.value)}
          value={source}
        >
          {sources.map((role) => (
            <FormControlLabel
              control={<Radio />}
              key={role.name}
              label={role.title}
              value={role.name}
            />
          ))}
        </RadioGroup>
      </Stack>
    </StaffSidePanel>
  );
}

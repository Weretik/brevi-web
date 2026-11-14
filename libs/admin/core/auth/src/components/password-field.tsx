import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

import type { KeyboardEvent } from 'react';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/** Password with a show/hide button and a Caps Lock hint. */
export function PasswordField({ onChange, value }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const readCapsLock = (event: KeyboardEvent<HTMLElement>) =>
    setCapsLock(event.getModifierState?.('CapsLock') ?? false);

  return (
    <TextField
      autoComplete="current-password"
      helperText={capsLock ? 'Увімкнено Caps Lock' : undefined}
      label="Пароль"
      onBlur={() => setCapsLock(false)}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={readCapsLock}
      onKeyUp={readCapsLock}
      required
      slotProps={{
        formHelperText: { sx: { color: 'warning.main' } },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visible ? 'Сховати пароль' : 'Показати пароль'}
                aria-pressed={visible}
                edge="end"
                onClick={() => setVisible((current) => !current)}
              >
                {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      type={visible ? 'text' : 'password'}
      value={value}
    />
  );
}

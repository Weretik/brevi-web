import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { IconButton, InputAdornment, TextField } from '@mui/material';

interface Props {
  label: string;
  /** Accessible name of the button that opens the link in a new tab. */
  openLabel: string;
  value: string;
  maxLength: number;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

/** A web link field with a button that opens the typed link in a new tab. */
export function PpeLinkField(props: Props) {
  const url = props.value.trim();
  return (
    <TextField
      label={props.label}
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      error={Boolean(props.error)}
      helperText={props.error ?? props.helperText}
      required={props.required}
      disabled={props.disabled}
      placeholder="https://"
      fullWidth
      slotProps={{
        htmlInput: { maxLength: props.maxLength, inputMode: 'url' },
        input: {
          endAdornment: url ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={props.openLabel}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                edge="end"
              >
                <OpenInNewOutlinedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}

import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';

import { useSearchHotkey } from '../../hooks/reference-list-controls/use-search-hotkey';

interface Props {
  placeholder: string;
  /** Accessible name, e.g. «Пошук тканин». */
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** «Цех» list search: its own full-width 48 px row under the page header; «/» focuses it. */
export function ReferenceSearchBar({ placeholder, label, value, onChange }: Props) {
  const inputRef = useSearchHotkey();
  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      value={value}
      inputRef={inputRef}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && value) onChange('');
      }}
      sx={{
        mb: 1.5,
        '& .MuiOutlinedInput-root': { height: 48, bgcolor: 'background.paper', fontSize: 15 },
      }}
      slotProps={{
        htmlInput: { 'aria-label': label, 'aria-keyshortcuts': '/' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {value ? (
                <IconButton
                  size="small"
                  aria-label="Очистити пошук"
                  sx={{ width: 40, height: 40 }}
                  onClick={() => onChange('')}
                >
                  <ClearOutlinedIcon fontSize="small" />
                </IconButton>
              ) : (
                <Box
                  component="kbd"
                  aria-hidden
                  sx={{
                    display: { xs: 'none', sm: 'inline-block' },
                    px: 0.75,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    fontFamily: 'var(--admin-font-mono)',
                    fontSize: 11,
                    color: 'text.secondary',
                  }}
                >
                  /
                </Box>
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

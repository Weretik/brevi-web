import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export interface FinanceSegment<Value extends string> {
  value: Value;
  label: string;
}

interface Props<Value extends string> {
  label: string;
  segments: FinanceSegment<Value>[];
  value: Value;
  onChange: (value: Value) => void;
}

/** One-choice segmented control, e.g. «Листопад · Жовтень · З 01.10 · Свій період…». */
export function FinanceSegmentedButtons<Value extends string>({
  label,
  segments,
  value,
  onChange,
}: Props<Value>) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      aria-label={label}
      onChange={(_, next: Value | null) => {
        if (next) onChange(next);
      }}
      sx={{
        p: 0.25,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexWrap: 'wrap',
        '& .MuiToggleButton-root': { px: 1.5, py: 0.5, border: 0, typography: 'subtitle2' },
        '& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover': {
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
        },
      }}
    >
      {segments.map((segment) => (
        <ToggleButton key={segment.value} value={segment.value}>
          {segment.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

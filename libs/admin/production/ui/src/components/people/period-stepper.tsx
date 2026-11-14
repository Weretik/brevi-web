import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { IconButton, Stack, Typography } from '@mui/material';

interface Props {
  label: string;
  canNext: boolean;
  onMove: (by: number) => void;
}

/** One period (month or year) for the whole «Персонал цеху» page. */
export function PeriodStepper({ label, canNext, onMove }: Props) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
      <IconButton aria-label="Попередній період" onClick={() => onMove(-1)}>
        <ChevronLeftOutlinedIcon />
      </IconButton>
      <Typography sx={{ minWidth: 140, textAlign: 'center', fontWeight: 600 }}>{label}</Typography>
      <IconButton aria-label="Наступний період" disabled={!canNext} onClick={() => onMove(1)}>
        <ChevronRightOutlinedIcon />
      </IconButton>
    </Stack>
  );
}

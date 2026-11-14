import { Checkbox, FormControlLabel, Stack } from '@mui/material';

import { ReportMonthField } from './report-month-field';

interface Props {
  /** The current month, the latest one to pick. */
  current: string;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  compare: boolean;
  onCompareChange: (on: boolean) => void;
  compareFrom: string;
  compareTo: string;
  onCompareFromChange: (value: string) => void;
  onCompareToChange: (value: string) => void;
}

/** «Звіти цеху»: the months of the report and, when on, the months to compare with. */
export function ReportPeriodBar({
  current,
  from,
  to,
  onFromChange,
  onToChange,
  compare,
  onCompareChange,
  compareFrom,
  compareTo,
  onCompareFromChange,
  onCompareToChange,
}: Props) {
  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 2 }}>
      <ReportMonthField label="Від" value={from} max={current} onChange={onFromChange} />
      <ReportMonthField label="До" value={to} max={current} onChange={onToChange} />
      <FormControlLabel
        control={
          <Checkbox checked={compare} onChange={(event) => onCompareChange(event.target.checked)} />
        }
        label="Порівняти з"
      />
      {compare && (
        <>
          <ReportMonthField
            label="Від"
            value={compareFrom}
            max={current}
            onChange={onCompareFromChange}
          />
          <ReportMonthField
            label="До"
            value={compareTo}
            max={current}
            onChange={onCompareToChange}
          />
        </>
      )}
    </Stack>
  );
}

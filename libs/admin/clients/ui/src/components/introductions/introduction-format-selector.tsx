import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import type { IntroductionFormat } from '@admin/clients/model';

const formats = [
  { value: 'general', label: 'Загальний', count: 8 },
  { value: 'summer', label: 'Літній', count: 4 },
  { value: 'winter', label: 'Зимовий', count: 4 },
] as const;

export function IntroductionFormatSelector({
  value,
  disabled,
  onChange,
}: {
  value: IntroductionFormat;
  disabled: boolean;
  onChange: (value: IntroductionFormat) => void;
}) {
  return (
    <FormControl disabled={disabled}>
      <FormLabel>Формат пропозиції для першого знайомства</FormLabel>
      <RadioGroup
        value={value}
        onChange={(event) => onChange(event.target.value as IntroductionFormat)}
      >
        {formats.map((format) => (
          <FormControlLabel
            key={format.value}
            value={format.value}
            control={<Radio />}
            label={`${format.label} · ${format.count} моделі`}
          />
        ))}
      </RadioGroup>
      <Typography variant="caption">
        У кожному сезоні одна головна позиція та три інші моделі. Підтвердження конкретної головної
        моделі виконує сервер.
      </Typography>
    </FormControl>
  );
}

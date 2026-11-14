import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import type { AiModelTier, AiSettings } from '@admin/ai/model';

interface Props {
  settings: AiSettings;
  disabled: boolean;
  testingTier: AiModelTier | null;
  onTest: (tier: AiModelTier) => void;
}

const price = (value: number) => value.toLocaleString('uk-UA', { minimumFractionDigits: 2 });
const mono = { fontFamily: 'var(--admin-font-mono)' } as const;

/** Read-only models and prices; «Змінити» in the card title opens the side panel. */
export function AiModelsSection({ settings, disabled, testingTier, onTest }: Props) {
  const rows = [
    {
      tier: 'Fast' as const,
      use: 'Кожен рахунок',
      model: settings.fastModel,
      prices: `${price(settings.fastInputPrice)} / ${price(settings.fastOutputPrice)}`,
    },
    {
      tier: 'Strong' as const,
      use: 'Повтор, якщо суми не зійшлися',
      model: settings.strongModel,
      prices: `${price(settings.strongInputPrice)} / ${price(settings.strongOutputPrice)}`,
    },
  ];
  return (
    <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Table size="small" aria-label="Моделі й ціни" sx={{ minWidth: 520 }}>
        <TableHead>
          <TableRow>
            <TableCell>Для чого</TableCell>
            <TableCell>Модель</TableCell>
            <TableCell>Вхід / вихід, $ за 1 млн токенів</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.tier}>
              <TableCell>{row.use}</TableCell>
              <TableCell sx={mono}>{row.model}</TableCell>
              <TableCell sx={mono}>{row.prices}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<FactCheckOutlinedIcon />}
                  disabled={disabled || !settings.hasKey}
                  aria-label={`Перевірити ${row.model}`}
                  onClick={() => onTest(row.tier)}
                >
                  {testingTier === row.tier ? 'Перевірка…' : 'Перевірити'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

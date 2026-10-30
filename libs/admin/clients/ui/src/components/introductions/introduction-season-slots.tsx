import { Alert, Button, Card, CardContent, Stack, Typography } from '@mui/material';

import type { IntroductionSlotView } from '@admin/clients/model';

const seasonLabel = { summer: 'Літо', winter: 'Зима' } as const;

export function IntroductionSeasonSlots({
  slots,
  disabled,
  onChooseProduct,
  onChooseFabric,
}: {
  slots: readonly IntroductionSlotView[];
  disabled: boolean;
  onChooseProduct: (slotKey: string) => void;
  onChooseFabric: (slotKey: string) => void;
}) {
  return (
    <Stack spacing={2} aria-label="Сезонні позиції пропозиції">
      {slots.map(({ slot, productLabel, fabricLabel, blockers }) => (
        <Card key={slot.key} variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">
                {seasonLabel[slot.season]} · позиція {slot.position}
                {slot.featured ? ' · головна модель' : ''}
              </Typography>
              <Typography>Модель: {productLabel ?? 'не обрана'}</Typography>
              <Typography>Тканина або артикул: {fabricLabel ?? 'не обрано'}</Typography>
              {blockers.map((message, index) => (
                <Alert severity="error" key={`${slot.key}-${index}`}>
                  {message}
                </Alert>
              ))}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button type="button" disabled={disabled} onClick={() => onChooseProduct(slot.key)}>
                  Обрати модель
                </Button>
                <Button type="button" disabled={disabled} onClick={() => onChooseFabric(slot.key)}>
                  Обрати тканину
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

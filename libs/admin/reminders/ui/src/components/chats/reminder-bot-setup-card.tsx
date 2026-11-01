import { Box, Button, Card, Stack, Typography } from '@mui/material';

interface Props {
  connecting: boolean;
  onConnect: () => void;
}

const steps = [
  'Натисніть «Підключити бота» один раз після розгортання: кнопки в Telegram почнуть приходити сюди.',
  'Додайте бота в групу або напишіть йому /start в особистому чаті. Чат зʼявиться в таблиці.',
  'Підтвердьте чат і призначте його задачам потрібних організацій.',
];

export function ReminderBotSetupCard({ connecting, onConnect }: Props) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Box>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            Як підключити чат
          </Typography>
          <Stack component="ol" spacing={0.5} sx={{ m: 0, pl: 2.5 }}>
            {steps.map((step) => (
              <Typography component="li" variant="body2" key={step}>
                {step}
              </Typography>
            ))}
          </Stack>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Button variant="outlined" disabled={connecting} onClick={onConnect}>
            {connecting ? 'Підключаємо…' : 'Підключити бота'}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}

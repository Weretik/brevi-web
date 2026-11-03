import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Collapse, Paper, Stack, Typography } from '@mui/material';
import { useId, useState } from 'react';

const steps = [
  'Підготуйте дані: артикул, назва, розділ, одиниця, постачальник, посилання і артикул постачальника, ціна.',
  'Розділ і постачальник тільки зі списків.',
  'Оберіть правило націнки; ручна ціна — тільки якщо ціну постачальника вводите вручну.',
  'Перевірте 3 ціни і примітку.',
  '«Перевірено» — тільки після ручної перевірки.',
];

/** Short form of the client's sheet instruction for the tab «ЗІЗ». */
export function PpeCreateGuideCard() {
  const [open, setOpen] = useState(true);
  const contentId = useId();
  return (
    <Paper variant="outlined" component="section" aria-label="Інструкція" sx={{ p: 2 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Інструкція
        </Typography>
        <Button
          size="small"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
          endIcon={
            <ExpandMoreIcon
              sx={(theme) => ({
                transform: open ? 'rotate(180deg)' : 'none',
                transition: theme.transitions.create('transform'),
              })}
            />
          }
        >
          {open ? 'Згорнути' : 'Показати'}
        </Button>
      </Stack>
      <Collapse in={open} id={contentId}>
        <Box component="ol" sx={{ m: 0, mt: 1.5, pl: 2.5, display: 'grid', gap: 0.75 }}>
          {steps.map((step) => (
            <Typography key={step} component="li" variant="body2">
              {step}
            </Typography>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
}

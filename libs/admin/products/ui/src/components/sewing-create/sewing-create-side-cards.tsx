import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

import type { SewingCreateLabour } from '@admin/products/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;
const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 });

/** «Трудовитрати»: minutes per product and pieces per shift. */
export function SewingCreateLabourCard({ labour }: { labour: SewingCreateLabour }) {
  const cells = [
    { label: 'Хв на виріб', value: minutes.format(labour.minutes) },
    { label: 'Шт. за зміну', value: String(labour.piecesPerShift) },
  ];
  return (
    <Card variant="outlined">
      <CardContent sx={{ display: 'grid', gap: 1.5 }}>
        <Typography variant="h6" component="h2">
          Трудовитрати
        </Typography>
        <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {cells.map((cell) => (
            <Box key={cell.label}>
              <Typography variant="overline" component="dt" sx={{ color: 'text.secondary' }}>
                {cell.label}
              </Typography>
              <Typography component="dd" sx={{ m: 0, fontSize: 22, fontWeight: 600, ...mono }}>
                {cell.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

/** Collapsible «Інструкція» with the sheet rule of the current step. */
export function SewingCreateInstructionCard({ text }: { text: string }) {
  return (
    <Accordion variant="outlined" defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="sewing-create-instruction">
        <Typography variant="h6" component="h2">
          Інструкція
        </Typography>
      </AccordionSummary>
      <AccordionDetails id="sewing-create-instruction">
        <Typography variant="body2">{text}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}

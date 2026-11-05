import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';

interface Props {
  text: string;
}

/**
 * The fixed instruction the system sends to the AI, shown for reading only: it cannot be changed
 * here, so it cannot be spoilt. Collapsed by default so the conditions stay in sight.
 */
export function AiBaseInstruction({ text }: Props) {
  if (!text.trim()) return null;
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', borderRadius: 1, '&::before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <LockOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Базова інструкція
          </Typography>
          <Typography variant="body2" color="text.secondary">
            лише для читання
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Її надсилає система, змінити тут не можна. Англійською, бо так ШІ читає її точніше. Ваші
          умови нижче додаються після неї.
        </Typography>
        <Box
          component="pre"
          aria-label="Текст базової інструкції"
          sx={{
            m: 0,
            p: 1.5,
            maxHeight: 360,
            overflow: 'auto',
            bgcolor: 'action.hover',
            borderRadius: 1,
            fontFamily: 'var(--admin-font-mono)',
            fontSize: 12,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {text.trim()}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

import { quoteTextMaxLength } from '@admin/quotes/model';
import { Box, TextField } from '@mui/material';

import type { QuoteItemDraft } from '@admin/quotes/model';

/** «Опис позиції у КП»: the text the client sees; a catalogue item starts from its short description. */
export function QuoteItemDescription({
  item,
  onChange,
}: {
  item: QuoteItemDraft;
  onChange: (patch: Partial<QuoteItemDraft>) => void;
}) {
  const own =
    item.kind === 'OneOffPpe' || item.kind === 'CustomSewing' || item.kind === 'Embroidery';
  return (
    <Box sx={{ px: 2, pt: 1.5 }}>
      <TextField
        fullWidth
        multiline
        minRows={2}
        size="small"
        label="Опис позиції у КП"
        placeholder="Короткий опис для клієнта: що це за виріб, для кого, переваги"
        value={item.description}
        onChange={(event) => onChange({ description: event.target.value })}
        helperText={
          own
            ? 'Бачить клієнт у КП.'
            : 'Підтягується з «Короткого опису для КП» у товарі. Зміна діє лише в цьому КП.'
        }
        slotProps={{ htmlInput: { maxLength: quoteTextMaxLength } }}
      />
    </Box>
  );
}

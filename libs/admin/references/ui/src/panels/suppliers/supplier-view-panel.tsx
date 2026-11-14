import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Chip, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { useId } from 'react';

import { SupplierContacts, supplierSectionTitle as sectionTitle } from './view/supplier-contacts';
import { SupplierRelatedList } from './view/supplier-related-list';

import type { SupplierViewRelatedRow } from './view/supplier-related-list';
import type { Supplier } from '@admin/references/model';

export type { SupplierViewRelatedRow } from './view/supplier-related-list';

interface Props {
  supplier: Supplier;
  /** An extra section under the contacts, for example «Тканини цього постачальника в КП». */
  related?: { title: string; rows: readonly SupplierViewRelatedRow[] };
  /** «Відкрити в контрагентах»; left out for those who may not open the supplier there. */
  onOpenInCounterparties?: () => void;
  onClose: () => void;
}

/**
 * The supplier's read-only card, opened from a supplier name anywhere in the admin (CAT-019, КП R-32).
 * Contacts are links: a call, a letter, the supplier's site.
 */
export function SupplierViewPanel({ supplier, related, onOpenInCounterparties, onClose }: Props) {
  const titleId = useId();
  const categories = supplier.purchaseCategories?.trim();
  const notes = supplier.notes?.trim();

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': titleId,
          sx: { width: { xs: '100%', sm: 440 }, display: 'flex', flexDirection: 'column' },
        },
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', px: 3, py: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          Постачальник
        </Typography>
        <IconButton aria-label="Закрити" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider />
      <Stack spacing={3} sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
        <Stack spacing={1}>
          <Typography
            id={titleId}
            component="h2"
            sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}
          >
            {supplier.name}
          </Typography>
          {categories && (
            <Typography variant="body2" color="text.secondary">
              {categories}
            </Typography>
          )}
          {!supplier.isActive && (
            <Box>
              <Chip size="small" color="warning" label="Не використовується в проєкті" />
            </Box>
          )}
        </Stack>
        <SupplierContacts supplier={supplier} />
        <SupplierRelatedList related={related} />

        {notes && (
          <Stack spacing={1}>
            <Typography sx={sectionTitle}>Нотатки</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
              {notes}
            </Typography>
          </Stack>
        )}
      </Stack>
      {onOpenInCounterparties && (
        <>
          <Divider />
          <Box sx={{ px: 3, py: 2 }}>
            <Button fullWidth size="large" variant="contained" onClick={onOpenInCounterparties}>
              Відкрити в контрагентах
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
}

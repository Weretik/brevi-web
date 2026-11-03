import { ppeReadyStatus } from '@admin/products/model';
import { PpeCardPrices, PpeSupplierForm, SewingCardHeader } from '@admin/products/ui';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { useState } from 'react';

import { PpeCardMetrics } from './ppe-card-metrics';
import { usePpeCard } from '../../hooks/ppe-card/use-ppe-card';
import { usePpeSupplierForm } from '../../hooks/ppe-card/use-ppe-supplier-form';
import { ProductDeleteDialog } from '../product-deletion/product-delete-dialog';
import { ProductOverviewDrawer } from '../product-overview/product-overview-drawer';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  product: ProductDetail;
  onDeleted: () => void;
}

/**
 * Card of one PPE product (CAT-008): what the sheet tab «ЗІЗ» holds for it and its three prices
 * from «Прайс на сайт». Site texts and photos are not shown here.
 */
export function PpeProductCard({ product, onDeleted }: Props) {
  const card = usePpeCard(product.id);
  const form = usePpeSupplierForm(card.offer);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const sectionName =
    card.row?.sectionId == null ? null : (card.sectionNames.get(card.row.sectionId) ?? null);

  return (
    <Stack sx={{ gap: 2 }}>
      <SewingCardHeader
        kindLabel="ЗІЗ"
        name={card.row?.name ?? product.name}
        code={card.row?.code ?? null}
        sectionName={sectionName}
        season={null}
        active={card.row?.isActive ?? null}
        verified={card.row?.isVerified ?? false}
        verifiedOn={card.row?.verifiedOn ?? null}
        siteUrl={card.row?.currentSiteUrl ?? null}
        status={card.status}
        canEdit={Boolean(card.row) && card.canManage}
        deleteDisabled={form.dirty || form.saving}
        onEdit={() => setEditing(true)}
        onDelete={() => setDeleting(true)}
      />
      <PpeCardMetrics offer={card.offer} />
      {card.offerLoading && <CircularProgress aria-label="Завантаження постачальника" />}
      {card.offerError && (
        <Alert severity="error" action={<Button onClick={card.reloadOffer}>Повторити</Button>}>
          {card.offerError}
        </Alert>
      )}
      {form.saveError && <Alert severity="error">{form.saveError}</Alert>}
      {card.offer && form.values && (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 3fr) minmax(280px, 2fr)' },
            alignItems: 'start',
          }}
        >
          <PpeSupplierForm
            values={form.values}
            errors={form.errors}
            suppliers={card.suppliers}
            ruleNames={card.ruleNames}
            readOnly={!card.canManage}
            dirty={form.dirty}
            saving={form.saving}
            onChange={form.change}
            onSave={() => void form.submit()}
            onReset={form.reset}
          />
          <PpeCardPrices
            prices={card.offer.prices}
            reasons={card.reasons}
            readyLabel={ppeReadyStatus}
            rule={card.rule}
            insightWholesale={card.offer.insightWholesale}
            insightRetail={card.offer.insightRetail}
          />
        </Box>
      )}
      {editing && card.row && (
        <ProductOverviewDrawer
          mode="edit"
          showCardLink={false}
          row={card.row}
          sections={card.sections}
          sectionNames={card.sectionNames}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            card.reloadOverview();
            card.reloadOffer();
          }}
        />
      )}
      <ProductDeleteDialog
        id={deleting ? product.id : null}
        name={product.name}
        onClose={() => setDeleting(false)}
        onDeleted={onDeleted}
      />
    </Stack>
  );
}

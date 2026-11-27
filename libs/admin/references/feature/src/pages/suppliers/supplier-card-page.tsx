import { CounterpartyFinance } from '@admin/accounting/feature';
import { SupplierPurchaseInvoices } from '@admin/purchasing/feature';
import { useCardPeriod } from '@admin/shared/routing';
import { CardPeriodFilter, usePageRights } from '@admin/shared/ui';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SupplierCardHeader } from '../../components/supplier-card/supplier-card-header';
import { SupplierCardTabs } from '../../components/supplier-card/supplier-card-tabs';
import { SupplierMaterials } from '../../components/supplier-card/supplier-materials';
import { SupplierOverview } from '../../components/supplier-card/supplier-overview';
import { SupplierProducts } from '../../components/supplier-card/supplier-products';
import { SupplierReceipts } from '../../components/supplier-card/supplier-receipts';
import { SupplierDrawer } from '../../components/suppliers/supplier-drawer';
import { useSupplierCard } from '../../hooks/supplier-card/use-supplier-card';
import { useSupplierMaterials } from '../../hooks/supplier-card/use-supplier-materials';
import { useSupplierTab } from '../../hooks/supplier-card/use-supplier-tab';

import type { SupplierCardAccess } from '../../references.routes';

const back = '/references/counterparties?tab=suppliers';

/**
 * Supplier card (CARD-001): the same page as a client card. Header, one period for every tab, «Огляд» and
 * the lists of everything linked to the supplier. «Редагувати» opens the usual side panel.
 */
export default function SupplierCardPage({ access }: { access: SupplierCardAccess }) {
  const navigate = useNavigate();
  const card = useSupplierCard();
  const { tab, tabs, setTab } = useSupplierTab(access);
  const { period, setPeriod, from, to } = useCardPeriod();
  const [editing, setEditing] = useState(false);
  const { canEdit } = usePageRights();
  const { supplier } = card;
  const materials = useSupplierMaterials(supplier, !access.materials);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {card.loading && <CircularProgress aria-label="Завантаження постачальника" />}
      {card.failed && (
        <Alert severity="error" action={<Button onClick={card.retry}>Повторити</Button>}>
          Не вдалося завантажити постачальника.
        </Alert>
      )}
      {card.missing && (
        <Alert
          severity="warning"
          action={<Button onClick={() => navigate(back)}>До списку</Button>}
        >
          Постачальника не знайдено в «Контрагенти → Постачальники».
        </Alert>
      )}
      {supplier && (
        <Stack spacing={2.5}>
          <SupplierCardHeader
            supplier={supplier}
            canEdit={canEdit}
            onBack={() => navigate(back)}
            onEdit={() => setEditing(true)}
          />
          {tab === 'finance' || tab === 'fabrics' || tab === 'accessories' || tab === 'products' ? (
            <Typography variant="body2" color="text.secondary">
              {tab === 'finance'
                ? '«Фінанси» мають свій період у фільтрах нижче.'
                : 'Довідник показує все, що є зараз; період тут не діє.'}
            </Typography>
          ) : (
            <CardPeriodFilter value={period} onChange={setPeriod} />
          )}
          <SupplierCardTabs tab={tab} tabs={tabs} onChange={setTab} />
          {tab === 'overview' && (
            <SupplierOverview
              supplier={supplier}
              access={access}
              fabrics={materials.loading ? undefined : materials.fabrics.length}
              accessories={materials.loading ? undefined : materials.accessories.length}
              from={from}
              to={to}
              onTab={setTab}
            />
          )}
          {tab === 'fabrics' && (
            <SupplierMaterials
              rows={materials.fabrics.map((row) => ({ ...row, unit: 'м' }))}
              loading={materials.loading}
              failed={materials.failed}
              emptyLabel="Тканин цього постачальника в довіднику немає."
              onRetry={materials.retry}
            />
          )}
          {tab === 'accessories' && (
            <SupplierMaterials
              rows={materials.accessories}
              loading={materials.loading}
              failed={materials.failed}
              emptyLabel="Фурнітури цього постачальника в довіднику немає."
              onRetry={materials.retry}
            />
          )}
          {tab === 'products' && <SupplierProducts supplierId={supplier.id} />}
          {tab === 'receipts' && <SupplierReceipts supplierId={supplier.id} from={from} to={to} />}
          {tab === 'invoices' && (
            <SupplierPurchaseInvoices supplierId={supplier.id} from={from} to={to} />
          )}
          {tab === 'finance' && <CounterpartyFinance kind="Supplier" id={String(supplier.id)} />}
        </Stack>
      )}
      {supplier && editing && (
        <SupplierDrawer
          mode="edit"
          supplier={supplier}
          nextId={card.nextId}
          onClose={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      )}
    </Box>
  );
}

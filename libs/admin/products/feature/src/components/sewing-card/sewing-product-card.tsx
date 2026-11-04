import { isSewingCreateReady, sewingVariantRows } from '@admin/products/model';
import { SewingCardHeader } from '@admin/products/ui';
import { Alert, Box, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { SewingCardMetrics } from './sewing-card-metrics';
import { SewingCardPricingTab } from './sewing-card-pricing-tab';
import { useProductActiveSwitch } from '../../hooks/product-overview/use-product-active-switch';
import {
  sewingCardTabLabels,
  sewingCardTabs,
  useSewingCardTab,
} from '../../hooks/sewing-card/use-sewing-card-tab';
import { useSewingModelCard } from '../../hooks/sewing-model/use-sewing-model-card';
import { ProductDeleteDialog } from '../product-deletion/product-delete-dialog';
import { ProductOverviewDrawer } from '../product-overview/product-overview-drawer';
import { ProductPhotosTab } from '../product-photos/product-photos-tab';
import { SewingLabourTab } from '../sewing-model/sewing-labour-tab';
import { SewingMaterialsTab } from '../sewing-model/sewing-materials-tab';
import { SewingVariantsTab } from '../sewing-model/sewing-variants-tab';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  product: ProductDetail;
  onDeleted: () => void;
}

/**
 * Card of one sewing model (CAT-007, CAT-015): the sheet tabs «Прайс на сайт» (one row per fabric),
 * «Комплектація виробів» and «Трудовитрати виробів» in one place. Every change saves at once.
 */
export function SewingProductCard({ product, onDeleted }: Props) {
  const { card, model, writes, modelCode } = useSewingModelCard(product.id);
  const { tab, setTab } = useSewingCardTab();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeError, setActiveError] = useState<string | null>(null);
  const activeSwitch = useProductActiveSwitch(setActiveError);
  const [pricingArticleId, setPricingArticleId] = useState<number | null>(null);
  const launched =
    card.row?.isActive !== false && (!card.summaryLoaded || isSewingCreateReady(card.articles));
  const sectionName =
    card.row?.sectionId == null ? null : (card.sectionNames.get(card.row.sectionId) ?? null);

  return (
    <Stack sx={{ gap: 2 }}>
      <SewingCardHeader
        name={card.row?.name ?? product.name}
        code={modelCode}
        sectionName={sectionName}
        season={card.row?.season ?? null}
        active={card.row?.isActive ?? null}
        siteUrl={card.row?.currentSiteUrl ?? null}
        status={card.status}
        canEdit={Boolean(card.row) && model.canManage}
        continueHref={
          card.row && !launched ? `/references/products/new/sewing?id=${product.id}&step=2` : null
        }
        deleteDisabled={writes.busy}
        onEdit={() => setEditing(true)}
        onDelete={() => setDeleting(true)}
        activeSwitch={
          card.row && model.canManage
            ? {
                saving: activeSwitch.savingId !== null,
                onChange: (active) => {
                  setActiveError(null);
                  if (card.row) activeSwitch.change(card.row, active);
                },
              }
            : undefined
        }
      />
      {activeError && (
        <Alert severity="error" onClose={() => setActiveError(null)}>
          {activeError}
        </Alert>
      )}
      <SewingCardMetrics totals={card.totals} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, value: typeof tab) => setTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Розділи картки"
        >
          {sewingCardTabs.map((value) => (
            <Tab key={value} value={value} label={sewingCardTabLabels[value]} />
          ))}
        </Tabs>
      </Box>
      {tab === 'fabrics' && <SewingVariantsTab model={model} writes={writes} />}
      {tab === 'materials' && <SewingMaterialsTab model={model} writes={writes} />}
      {tab === 'labour' && (
        <SewingLabourTab
          model={model}
          writes={writes}
          seamstressPerMinute={card.seamstressPerMinute}
        />
      )}
      {tab === 'pricing' && (
        <SewingCardPricingTab
          productId={product.id}
          variants={sewingVariantRows(model.summary)}
          articleId={pricingArticleId}
          onSelect={setPricingArticleId}
        />
      )}
      {tab === 'photos' && (
        <ProductPhotosTab productId={product.id} productName={card.row?.name ?? product.name} />
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

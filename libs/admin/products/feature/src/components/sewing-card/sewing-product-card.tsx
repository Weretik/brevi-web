import { isSewingCreateReady } from '@admin/products/model';
import { SewingCardHeader, SewingLabourTable } from '@admin/products/ui';
import { Alert, Box, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { SewingCardArticlesTab } from './sewing-card-articles-tab';
import { SewingCardMetrics } from './sewing-card-metrics';
import { SewingCardPricingTab } from './sewing-card-pricing-tab';
import { useSewingCard } from '../../hooks/sewing-card/use-sewing-card';
import { useSewingCardComposition } from '../../hooks/sewing-card/use-sewing-card-composition';
import {
  sewingCardTabLabels,
  sewingCardTabs,
  useSewingCardTab,
} from '../../hooks/sewing-card/use-sewing-card-tab';
import { useSewingCompositionController } from '../../hooks/sewing-composition/use-sewing-composition-controller';
import { ProductDeleteDialog } from '../product-deletion/product-delete-dialog';
import { ProductOverviewDrawer } from '../product-overview/product-overview-drawer';
import { SewingCompositionScreen } from '../sewing-composition/sewing-composition-screen';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  product: ProductDetail;
  onDeleted: () => void;
}

/**
 * Card of one sewing model (CAT-007): the sheet tabs «Товари», «Прайс на сайт», «Комплектація
 * виробів» and «Трудовитрати виробів» in one place. Site texts and photos are not shown here.
 */
export function SewingProductCard({ product, onDeleted }: Props) {
  const card = useSewingCard(product.id);
  const controller = useSewingCompositionController(product.id);
  const { tab, setTab } = useSewingCardTab();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pricingArticleId, setPricingArticleId] = useState<number | null>(null);
  const { drafts, selection, queries } = controller;
  const code = card.row?.code ?? null;
  const { labour, labourMinutes } = useSewingCardComposition(
    controller,
    code,
    Boolean(card.row),
    card.seamstressPerMinute,
  );
  const launched =
    card.row?.isActive !== false && (!card.summaryLoaded || isSewingCreateReady(card.articles));
  const sectionName =
    card.row?.sectionId == null ? null : (card.sectionNames.get(card.row.sectionId) ?? null);

  return (
    <Stack sx={{ gap: 2 }}>
      <SewingCardHeader
        name={card.row?.name ?? product.name}
        code={code ?? queries.articles.data?.modelCode ?? null}
        sectionName={sectionName}
        season={card.row?.season ?? null}
        active={card.row?.isActive ?? null}
        verified={card.row?.isVerified ?? false}
        verifiedOn={card.row?.verifiedOn ?? null}
        siteUrl={card.row?.currentSiteUrl ?? null}
        status={card.status}
        canEdit={Boolean(card.row) && controller.canManage}
        continueHref={
          card.row && !launched ? `/references/products/new/sewing?id=${product.id}&step=2` : null
        }
        deleteDisabled={drafts.dirty || controller.busy}
        onEdit={() => setEditing(true)}
        onDelete={() => setDeleting(true)}
      />
      <SewingCardMetrics totals={card.totals} labourMinutes={labourMinutes} />
      {drafts.dirty && (
        <Alert severity="warning">
          Є незбережені зміни складу. Збережіть або скасуйте їх, щоб перейти зі сторінки.
        </Alert>
      )}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, value: typeof tab) => {
            // Operations belong to the whole model, so the labour tab edits the shared composition.
            if (value === 'labour' && selection.scope === 'Article') selection.requestModel();
            setTab(value);
          }}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Розділи картки"
        >
          {sewingCardTabs.map((value) => (
            <Tab key={value} value={value} label={sewingCardTabLabels[value]} />
          ))}
        </Tabs>
      </Box>
      {tab === 'articles' && (
        <SewingCardArticlesTab
          rows={card.articles}
          loading={card.summaryLoading}
          error={card.summaryError}
          onRetry={card.reloadSummary}
          canCreate={controller.canManage && Boolean(queries.articles.data)}
          version={queries.articles.data?.version ?? 0}
          creating={controller.articleCreation.state.isLoading}
          createError={controller.articleCreation.error}
          onCreate={selection.requestCreateArticle}
          onOpen={(articleId) => {
            setPricingArticleId(articleId);
            setTab('pricing');
          }}
        />
      )}
      {tab === 'materials' && (
        <SewingCompositionScreen
          productId={product.id}
          controller={controller}
          section="materials"
        />
      )}
      {tab === 'labour' && (
        <Stack sx={{ gap: 2 }}>
          <SewingLabourTable lines={labour} costsKnown={card.seamstressPerMinute !== null} />
          <SewingCompositionScreen
            productId={product.id}
            controller={controller}
            section="operations"
          />
        </Stack>
      )}
      {tab === 'pricing' && (
        <SewingCardPricingTab
          productId={product.id}
          articles={card.articles}
          articleId={pricingArticleId}
          dirty={drafts.dirty || controller.busy}
          onSelect={setPricingArticleId}
        />
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

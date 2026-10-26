import { SewingArticlesPanel } from '@admin/products/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';

import { CompositionScopeEditors } from './composition-scope-editors';
import { CompositionScopeHeader } from './composition-scope-header';
import { CompositionStatusPanels } from './composition-status-panels';
import { StaleCompositionAlert } from './stale-composition-alert';
import { UnsavedChangesDialog } from './unsaved-changes-dialog';
import { SewingPricingFeature } from '../sewing-pricing/sewing-pricing-feature';

import type { useSewingCompositionController } from '../../hooks/sewing-composition/use-sewing-composition-controller';

interface Props {
  productId: number;
  controller: ReturnType<typeof useSewingCompositionController>;
}

export function SewingCompositionScreen({ productId, controller }: Props) {
  const {
    access,
    queries,
    selection,
    drafts,
    writes,
    articleCreation,
    canManage,
    sewingLookups,
    view,
    busy,
    navigation,
  } = controller;
  const { fabrics, accessories, operations, articles, sharedComposition, selectedComposition } =
    queries;
  const {
    scope,
    selectedArticleId,
    pendingSwitch,
    setPendingSwitch,
    requestModel,
    requestArticle,
    requestCreateArticle,
    confirmSwitch,
  } = selection;
  const {
    modelDraft,
    setModelDraft,
    modelBaseline,
    modelDirty,
    setArticleDrafts,
    articleDraft,
    articleBaseline,
    articleDirty,
    updateModelMaterials,
    updateModelOperations,
    updateArticleMaterials,
  } = drafts;
  const { mutationError, reloadError } = writes;
  const {
    blocker: navigationBlocker,
    blocked: navigationBlocked,
    discardCurrentDraft,
  } = navigation;
  if (access.isLoading && !access.data) {
    return <CircularProgress aria-label="Перевірка доступу до складу" />;
  }
  if (access.isError || !access.data?.canRead) {
    return (
      <Alert
        severity={access.data?.canRead === false ? 'warning' : 'error'}
        action={<Button onClick={() => void access.refetch()}>Повторити</Button>}
      >
        {access.data?.canRead === false
          ? 'Немає права переглядати склад цього товару.'
          : adminApiErrorMessage(access.error, 'Не вдалося перевірити доступ до складу.')}
      </Alert>
    );
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <SewingArticlesPanel
        key={`${productId}-${articles.data?.articles.length ?? 0}`}
        articles={view.articlesWithReadiness}
        selectedArticleId={selectedArticleId}
        version={articles.data?.version ?? 0}
        canManage={canManage && Boolean(articles.data) && !articles.isLoading && !articles.isError}
        creating={articleCreation.state.isLoading}
        error={articleCreation.error}
        onSelect={requestArticle}
        onCreate={requestCreateArticle}
      />
      <CompositionStatusPanels
        listError={view.listError}
        lookupError={view.lookupErrorMessage}
        modelError={view.modelError}
        selectedError={view.selectedError}
        loading={view.loading}
        scope={scope}
        onRetryList={() => void articles.refetch()}
        onRetryLookups={() => {
          void fabrics.refetch();
          void accessories.refetch();
          void operations.refetch();
        }}
        onRetryModel={() => void sharedComposition.refetch()}
        onRetrySelected={() => void selectedComposition.refetch()}
      />
      <CompositionScopeHeader
        scope={scope}
        articleSku={view.selectedArticle?.saleSku}
        onSelectModel={requestModel}
      />
      <CompositionScopeEditors
        scope={scope}
        modelDraft={modelDraft}
        modelDirty={modelDirty}
        articleId={selectedArticleId}
        articleDraft={articleDraft}
        articleDirty={articleDirty}
        articleSku={view.selectedArticle?.saleSku}
        composition={scope === 'Model' ? sharedComposition.data : selectedComposition.data}
        selectedDraft={view.selectedViewDraft}
        lookups={sewingLookups}
        canManage={view.canManageComposition}
        saving={busy}
        errors={mutationError?.fieldErrors}
        error={mutationError?.message}
        onModelCodeChange={(value) =>
          setModelDraft((current) => (current ? { ...current, modelCode: value || null } : current))
        }
        onModelMaterialsChange={updateModelMaterials}
        onModelOperationsChange={updateModelOperations}
        onArticleMaterialsChange={updateArticleMaterials}
        onSaveModel={() => void writes.saveModel()}
        onSaveArticle={() => void writes.saveArticle()}
        onCancelModel={() => modelBaseline && setModelDraft(modelBaseline)}
        onCancelArticle={() => {
          if (articleBaseline && selectedArticleId !== null) {
            setArticleDrafts((current) => ({ ...current, [selectedArticleId]: articleBaseline }));
          }
        }}
      />
      {mutationError?.stale && (
        <StaleCompositionAlert
          scope={scope}
          message={reloadError}
          onReload={() => void writes.reloadCurrent()}
        />
      )}
      {scope === 'Article' && selectedArticleId !== null && view.selectedArticle && (
        <SewingPricingFeature
          key={`${productId}:${selectedArticleId}`}
          productId={productId}
          articleId={selectedArticleId}
          compositionVersion={articles.data?.version ?? 0}
          canManage={canManage}
          dirty={drafts.dirty || busy}
        />
      )}
      <UnsavedChangesDialog
        open={pendingSwitch !== null || navigationBlocked}
        navigationBlocked={navigationBlocked}
        busy={busy}
        creatingArticle={pendingSwitch?.scope === 'CreateArticle'}
        onStay={() => {
          if (navigationBlocker.state === 'blocked') navigationBlocker.reset();
          else setPendingSwitch(null);
        }}
        onDiscardAndContinue={() => {
          if (navigationBlocker.state === 'blocked') {
            discardCurrentDraft();
            navigationBlocker.proceed();
          } else {
            confirmSwitch();
          }
        }}
      />
    </Stack>
  );
}

import { ProductionQuoteSources } from '@admin/production/ui';
import { ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, CircularProgress, LinearProgress, Stack } from '@mui/material';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { ProductionOrderCreateHeader } from '../../components/order-create/production-order-create-header';
import { ProductionOrderCreateLine } from '../../components/order-create/production-order-create-line';
import { useProductionOrderCreate } from '../../hooks/order-editor/use-production-order-create';

import type { ProductionOrderActor } from '@admin/production/model';

interface Props {
  useOrderActor: () => ProductionOrderActor;
}

/** «Нове завдання»: a КП «під запит», then what the workshop needs for each of its items. */
export function ProductionOrderCreatePage({ useOrderActor }: Props) {
  const actor = useOrderActor();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // «Передати в цех» in the КП editor opens this page with the КП already picked.
  const fromQuote = Number(params.get('quote'));
  const create = useProductionOrderCreate(
    (order) => navigate(`/production/orders/${order.id}`, { replace: true }),
    Number.isInteger(fromQuote) && fromQuote > 0 ? fromQuote : null,
  );
  if (!actor.canCreate) return <Navigate to="/production/orders" replace />;

  const { draft, values, errors } = create;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Нове завдання"
        subtitle={
          draft
            ? `КП ${draft.number} · ${draft.clientName} · ${draft.managerName}`
            : 'Оберіть КП під запит, з якого шити'
        }
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            disabled={create.saving}
            onClick={() =>
              create.quoteId === null ? navigate('/production/orders') : create.pick(null)
            }
          >
            {create.quoteId === null ? 'До списку' : 'Інше КП'}
          </Button>
        }
      />
      {create.quoteId === null ? (
        <Stack sx={{ gap: 2 }}>
          <ReferenceSearchBar
            placeholder="Знайти КП за номером або клієнтом"
            label="Пошук КП"
            value={create.search}
            onChange={create.setSearch}
          />
          {create.sourcesError && <Alert severity="error">{create.sourcesError}</Alert>}
          {create.sourcesLoading && <LinearProgress />}
          {!create.sourcesError && (
            <ProductionQuoteSources
              sources={create.sources}
              loading={create.sourcesLoading}
              onPick={(source) => create.pick(source.id)}
            />
          )}
        </Stack>
      ) : create.draftError ? (
        <Alert severity="error">{create.draftError}</Alert>
      ) : !draft || !values ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress aria-label="Відкриваємо КП" />
        </Box>
      ) : (
        <Box
          component="form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void create.submit();
          }}
        >
          <Stack sx={{ gap: 2 }}>
            {create.message && <Alert severity="error">{create.message}</Alert>}
            {errors.form && <Alert severity="error">{errors.form}</Alert>}
            <ProductionOrderCreateHeader
              values={values}
              errors={errors.header}
              disabled={create.saving}
              onChange={create.change}
            />
            {draft.items.length === 0 && (
              <Alert severity="warning">У КП немає пошиву, тож передавати в цех нічого.</Alert>
            )}
            {draft.items.map((item) => {
              const line = values.lines.find((x) => x.quoteItemId === item.quoteItemId);
              return (
                line && (
                  <ProductionOrderCreateLine
                    key={item.quoteItemId}
                    item={item}
                    line={line}
                    errors={errors.lines[item.quoteItemId]}
                    disabled={create.saving}
                    onChange={(next) => create.changeLine(item.quoteItemId, next)}
                  />
                )
              );
            })}
            <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={create.saving || draft.items.length === 0}
                startIcon={create.saving ? <CircularProgress size={16} /> : undefined}
              >
                Передати в цех
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default ProductionOrderCreatePage;

import { productionOrderStatusLabels } from '@admin/production/model';
import {
  ProductionConfirmDialog,
  ProductionItemCard,
  ProductionOrderHistory,
  ProductionOrderPrint,
  ProductionOrderStatusPill,
} from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ProductionItemDrawer } from '../../components/orders/production-item-drawer';
import { ProductionOrderHeaderDrawer } from '../../components/orders/production-order-header-drawer';
import { ProductionOrderSummary } from '../../components/orders/production-order-summary';
import { useProductionOrder } from '../../hooks/orders/use-production-order';
import { useProductionOrderActions } from '../../hooks/orders/use-production-order-actions';
import { useProductionOrderEditor } from '../../hooks/orders/use-production-order-editor';

type OrderTab = 'description' | 'history';

const parseId = (value: string | undefined) =>
  value && /^\d+$/.test(value) ? Number(value) : null;

/** «Виробниче завдання № …»: «Опис» with every item and «Історія змін». */
export function ProductionOrderPage() {
  const id = parseId(useParams<{ id: string }>().id);
  const navigate = useNavigate();
  const [tab, setTab] = useState<OrderTab>('description');
  const [message, setMessage] = useState<string | null>(null);
  const data = useProductionOrder(id, tab === 'history');
  const order = data.order;
  const editor = useProductionOrderEditor(order, () => setMessage('Зміни збережено.'));
  const actions = useProductionOrderActions(order, {
    onCopied: (copy) => {
      setTab('description');
      setMessage(`Створено копію № ${copy.number}.`);
      navigate(`/production/orders/${copy.id}`);
    },
    onDeleted: () => navigate('/production/orders', { replace: true }),
    onError: setMessage,
  });

  if (id === null) return <Alert severity="error">Такого завдання немає.</Alert>;
  if (data.error)
    return (
      <ReferenceListAlerts
        error={data.error}
        loading={false}
        onRetry={() => void data.reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
    );
  if (!order)
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
        <CircularProgress aria-label="Відкриваємо завдання" />
      </Box>
    );

  const { permissions } = order;
  const editing = editor.editing;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Виробничі завдання"
        title={`Завдання № ${order.number}`}
        subtitle={`${order.clientName} · ${productionOrderStatusLabels[order.status]}`}
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/production/orders')}
            >
              До списку
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintOutlinedIcon />}
              onClick={() => window.print()}
            >
              Друк
            </Button>
            {permissions.canCopy && (
              <Button
                variant="outlined"
                startIcon={<ContentCopyOutlinedIcon />}
                disabled={actions.copying}
                onClick={() => void actions.copy()}
              >
                Копіювати
              </Button>
            )}
            {permissions.canDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlinedIcon />}
                onClick={actions.requestDelete}
              >
                Видалити
              </Button>
            )}
            {permissions.canEdit && (
              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={editor.editHeader}
              >
                Редагувати
              </Button>
            )}
          </>
        }
      />
      <ReferenceListAlerts
        error={null}
        loading={false}
        onRetry={() => undefined}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mb: 2 }}>
        <ProductionOrderStatusPill status={order.status} />
        <Tabs value={tab} onChange={(_event, next: OrderTab) => setTab(next)}>
          <Tab value="description" label="Опис" />
          <Tab value="history" label="Історія змін" />
        </Tabs>
      </Stack>
      {tab === 'description' ? (
        <Stack sx={{ gap: 2 }}>
          <ProductionOrderSummary order={order} />
          {order.items.map((item) => (
            <ProductionItemCard
              key={item.id}
              item={item}
              permissions={permissions}
              onEdit={permissions.canEdit ? () => editor.editItem(item) : undefined}
            />
          ))}
        </Stack>
      ) : data.historyError ? (
        <Alert severity="error">{data.historyError}</Alert>
      ) : data.historyLoading && data.history.length === 0 ? (
        <LinearProgress />
      ) : (
        <ProductionOrderHistory changes={data.history} />
      )}
      {editing?.kind === 'header' && (
        <ProductionOrderHeaderDrawer
          number={order.number}
          values={editing.values}
          errors={editor.headerErrors}
          message={editor.message}
          saving={editor.saving}
          onChange={editor.changeHeader}
          onClose={editor.close}
          onSubmit={() => void editor.save()}
        />
      )}
      {editing?.kind === 'item' && (
        <ProductionItemDrawer
          item={editing.item}
          values={editing.values}
          errors={editor.itemErrors}
          withRate={permissions.seesSewingRate}
          message={editor.message}
          saving={editor.saving}
          onChange={editor.changeItem}
          onClose={editor.close}
          onSubmit={() => void editor.save()}
        />
      )}
      <ProductionConfirmDialog
        open={actions.confirmingDelete}
        title="Видалити завдання?"
        text={`Завдання № ${order.number} зникне зі списку. КП залишиться.`}
        confirmLabel="Видалити"
        danger
        busy={actions.deleting}
        onClose={actions.cancelDelete}
        onConfirm={() => void actions.confirmDelete()}
      />
      <ProductionOrderPrint order={order} />
    </Box>
  );
}

export default ProductionOrderPage;

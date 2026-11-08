import { useGetProductionOrdersQuery } from '@admin/production/data-access';
import { productionOrderStatusLabels } from '@admin/production/model';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import { Alert, Box, Button, Link, Paper, Stack, Typography } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  /** Null for a new КП: nothing has been passed yet. */
  quoteId: number | null;
  /** «Передати в цех»: whoever may create «Виробничі завдання» and open КП. */
  canCreate: boolean;
  /** The editor saves the КП first (the workshop gets the saved version), then opens «Нове завдання». */
  onPass: () => void;
}

/** КП editor, right column: the orders made from this КП and «Передати в цех» (client corrections item 9). */
export function QuoteProductionOrders({ quoteId, canCreate, onPass }: Props) {
  const list = useGetProductionOrdersQuery(
    quoteId === null
      ? skipToken
      : {
          search: '',
          status: null,
          manager: null,
          dueTo: null,
          stage: null,
          page: 1,
          pageSize: 20,
          quoteId,
        },
  );
  const orders = list.data?.items ?? [];
  if (!canCreate && orders.length === 0) return null;

  return (
    <Paper variant="outlined" component="section" aria-label="Цех" sx={{ p: 2 }}>
      <Stack sx={{ gap: 1.25 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
          Цех
        </Typography>
        {list.isError && (
          <Alert
            severity="error"
            action={<Button onClick={() => void list.refetch()}>Повторити</Button>}
          >
            Не вдалося завантажити завдання цеху.
          </Alert>
        )}
        {!list.isError && !list.isFetching && orders.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Ще не передано в цех.
          </Typography>
        )}
        {orders.map((order) => (
          <Box key={order.id} sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
            <Link
              component={RouterLink}
              to={`/production/orders/${order.id}`}
              sx={{ fontFamily: 'var(--admin-font-mono)', fontWeight: 600 }}
            >
              №{order.number}
            </Link>
            <Typography variant="body2" color="text.secondary">
              {productionOrderStatusLabels[order.status]} · {order.totalQuantity} шт.
            </Typography>
          </Box>
        ))}
        {canCreate && (
          <Button variant="outlined" startIcon={<ContentCutOutlinedIcon />} onClick={onPass}>
            Передати в цех
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

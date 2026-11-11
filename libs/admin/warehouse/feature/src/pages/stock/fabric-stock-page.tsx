import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { useGetFabricStockQuery } from '@admin/warehouse/data-access';
import {
  formatMeters,
  kyivToday,
  searchFabricStock,
  stockBalancesWorkbook,
  XLSX_MIME_TYPE,
} from '@admin/warehouse/model';
import { FabricStockTable } from '@admin/warehouse/ui';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import MoveDownOutlinedIcon from '@mui/icons-material/MoveDownOutlined';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { FabricAdjustmentDrawer } from '../../components/operations/fabric-adjustment-drawer';
import { StockTransferDrawer } from '../../components/transfer/stock-transfer-drawer';
import { downloadFile } from '../../hooks/files/download-file';

import type { FabricStockPair } from '@admin/warehouse/model';

/**
 * «Склад тканин › Залишки»: only fabrics and colours the stock holds, alias offers and colour
 * spellings merged. A colour opens «Уточнити» for people who may move stock.
 */
export function FabricStockPage() {
  const stock = useGetFabricStockQuery();
  const [search, setSearch] = useState('');
  const [adjusting, setAdjusting] = useState<FabricStockPair | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [transferring, setTransferring] = useState(false);
  const fabrics = useMemo(
    () => searchFabricStock(stock.data?.fabrics ?? [], search),
    [stock.data, search],
  );
  const data = stock.data;
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Залишки"
        subtitle={
          data
            ? `На складі ${formatMeters(data.meters)} у ${data.pairs} парах тканина + колір${data.permissions.canMove ? '. Натисніть колір, щоб уточнити залишок.' : '.'}`
            : 'Скільки тканини лежить на полицях'
        }
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {data?.permissions.canTransfer && (
              <Button
                variant="outlined"
                startIcon={<MoveDownOutlinedIcon />}
                onClick={() => setTransferring(true)}
              >
                Перенесення з v133
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              disabled={!data?.fabrics.length}
              onClick={() =>
                data &&
                downloadFile(
                  stockBalancesWorkbook(data),
                  `zalyshky-tkanyn-${kyivToday()}.xlsx`,
                  XLSX_MIME_TYPE,
                )
              }
            >
              Завантажити всі залишки Excel
            </Button>
          </Stack>
        }
      />
      <ReferenceListAlerts
        error={stock.error ? 'Не вдалося завантажити залишки.' : null}
        loading={stock.isFetching}
        onRetry={() => void stock.refetch()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      {data && data.negative > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Відʼємний залишок у {data.negative} парах: витратили більше, ніж записано на складі.
        </Alert>
      )}
      <ReferenceSearchBar
        placeholder="Знайти за тканиною, кодом або кольором"
        label="Пошук залишків"
        value={search}
        onChange={setSearch}
      />
      {data && (
        <FabricStockTable
          fabrics={fabrics}
          searching={search.trim().length > 0}
          onAdjust={data.permissions.canMove ? setAdjusting : null}
        />
      )}
      {adjusting && (
        <FabricAdjustmentDrawer
          key={`${adjusting.fabric.fabricCode}|${adjusting.color.colorKey}`}
          pair={adjusting}
          onClose={() => setAdjusting(null)}
          onSaved={(text) => {
            setMessage(text);
            setAdjusting(null);
          }}
        />
      )}
      {transferring && <StockTransferDrawer onClose={() => setTransferring(false)} />}
    </Box>
  );
}

export default FabricStockPage;

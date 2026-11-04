import {
  useGetFabricStockChoicesQuery,
  useImportFabricStockMutation,
} from '@admin/production/data-access';
import {
  countFabricStock,
  fabricStockCsv,
  filterFabricStock,
  formatMeters,
  formatMoney,
  parseFabricStockImportFile,
  todayIso,
} from '@admin/production/model';
import { FabricStockChips, FabricStockGrid } from '@admin/production/ui';
import {
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Paper, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { FabricConsumptionDrawer } from '../../components/stock/fabric-consumption-drawer';
import { FabricCorrectionDrawer } from '../../components/stock/fabric-correction-drawer';
import { FabricReceiptDrawer } from '../../components/stock/fabric-receipt-drawer';
import { FabricStockLineDrawer } from '../../components/stock/fabric-stock-line-drawer';
import { downloadCsv } from '../../hooks/files/download-csv';
import { useFabricStock } from '../../hooks/stock/use-fabric-stock';

import type {
  FabricStockFilter,
  FabricStockRow,
  ProductionOrderActor,
} from '@admin/production/model';

interface Props {
  /** May the person import the old «Цех» stock. */
  useOrderActor: () => ProductionOrderActor;
}

type Panel =
  | { kind: 'line'; row: FabricStockRow }
  | { kind: 'receipt'; line: FabricStockRow | null }
  | { kind: 'correction'; line: FabricStockRow }
  | { kind: 'consumption' }
  | { kind: 'import' };

/** «Швейний цех › Склад тканин»: balance, reservation for «Нове» orders and what is available. */
export function FabricStockPage({ useOrderActor }: Props) {
  const actor = useOrderActor();
  const stock = useFabricStock();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FabricStockFilter>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const choices = useGetFabricStockChoicesQuery(undefined, {
    skip: panel?.kind !== 'receipt',
  });
  const [importStock] = useImportFabricStockMutation();
  const filtered = useMemo(
    () => filterFabricStock(stock.rows, search, filter),
    [stock.rows, search, filter],
  );
  const { canMove, seesValue } = stock.permissions;
  const totals = stock.totals;
  const done = (text: string) => {
    setMessage(text);
    setPanel(null);
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Склад тканин"
        subtitle={
          totals
            ? `На складі ${formatMeters(totals.meters)}, під замовлення ${formatMeters(totals.reserved)}${seesValue ? `, на ${formatMoney(totals.value)}` : ''}`
            : 'Скільки тканини лежить на полицях і скільки потрібно відкритим завданням'
        }
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {canMove && (
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={() => setPanel({ kind: 'receipt', line: null })}
              >
                Прихід
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<QueryStatsOutlinedIcon />}
              onClick={() => setPanel({ kind: 'consumption' })}
            >
              Зведення витрати
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              disabled={filtered.length === 0}
              onClick={() =>
                downloadCsv(fabricStockCsv(filtered, seesValue), `sklad-tkanyn-${todayIso()}.csv`)
              }
            >
              Excel
            </Button>
            {actor.canImport && (
              <Button
                variant="outlined"
                startIcon={<UploadFileOutlinedIcon />}
                disabled={stock.loading || Boolean(stock.error)}
                onClick={() => setPanel({ kind: 'import' })}
              >
                Імпорт
              </Button>
            )}
          </Stack>
        }
      />
      <ReferenceListAlerts
        error={stock.error}
        loading={stock.loading}
        onRetry={() => void stock.reload()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти за кодом, тканиною або кольором"
        label="Пошук тканин"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={
          <FabricStockChips
            total={stock.rows.length}
            counts={countFabricStock(stock.rows)}
            value={filter}
            onChange={setFilter}
          />
        }
        count={filtered.length}
        total={stock.rows.length}
        countLabel="Кількість рядків складу"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FabricStockGrid
          rows={filtered}
          loading={stock.loading}
          searching={stock.rows.length > 0}
          seesValue={seesValue}
          onOpen={(row) => setPanel({ kind: 'line', row })}
        />
      </Paper>
      {panel?.kind === 'line' && (
        <FabricStockLineDrawer
          key={panel.row.id ?? `${panel.row.fabricCode}-${panel.row.color}`}
          row={panel.row}
          onClose={() => setPanel(null)}
          onReceipt={(line) => setPanel({ kind: 'receipt', line })}
          onCorrect={(line) => setPanel({ kind: 'correction', line })}
          onMessage={setMessage}
        />
      )}
      {panel?.kind === 'receipt' && choices.data && (
        <FabricReceiptDrawer
          line={panel.line}
          choices={choices.data}
          versionOf={stock.versionOf}
          onClose={() => setPanel(null)}
          onSaved={done}
        />
      )}
      {panel?.kind === 'correction' && (
        <FabricCorrectionDrawer line={panel.line} onClose={() => setPanel(null)} onSaved={done} />
      )}
      {panel?.kind === 'consumption' && <FabricConsumptionDrawer onClose={() => setPanel(null)} />}
      {panel?.kind === 'import' && (
        <ProductionImportDrawer
          title="Імпорт складу тканин"
          description="Файл fabric-stock.json зі старого «Цеху»: залишки, рухи й видачі. Спершу перевіримо, потім збережемо."
          keyLabel="Тканина"
          detailLabel="Колір"
          parse={parseFabricStockImportFile}
          send={(rows, dryRun) => importStock({ file: rows[0], dryRun }).unwrap()}
          onClose={() => setPanel(null)}
        />
      )}
    </Box>
  );
}

export default FabricStockPage;

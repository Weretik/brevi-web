import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import { useGetFabricStockQuery } from '@admin/warehouse/data-access';
import {
  filterFabricStock,
  formatMeters,
  kyivToday,
  searchFabricStock,
  sortFabricStock,
  stockBalancesWorkbook,
  stockProblemCounts,
  stockSuppliers,
  XLSX_MIME_TYPE,
} from '@admin/warehouse/model';
import { FabricStockFilters, FabricStockTable, WarehouseMoreMenu } from '@admin/warehouse/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import MoveDownOutlinedIcon from '@mui/icons-material/MoveDownOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Box, Button, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { IssueToItemDrawer } from '../../components/item-issue/issue-to-item-drawer';
import { FabricAdjustmentDrawer } from '../../components/operations/fabric-adjustment-drawer';
import { FabricIssueDrawer } from '../../components/operations/fabric-issue-drawer';
import { FabricOpeningDrawer } from '../../components/operations/fabric-opening-drawer';
import { FabricReceiptDrawer } from '../../components/operations/fabric-receipt-drawer';
import { FabricStockPairDrawer } from '../../components/stock/fabric-stock-pair-drawer';
import { StockTransferDrawer } from '../../components/transfer/stock-transfer-drawer';
import { downloadFile } from '../../hooks/files/download-file';

import type { FabricStockPair, StockProblem, StockSortKey } from '@admin/warehouse/model';

type Panel =
  | { kind: 'receipt' | 'issue' | 'item-issue' | 'opening' | 'transfer' }
  | { kind: 'pair' | 'adjust'; pair: FabricStockPair };

/**
 * «Склад тканин › Залишки»: one row per fabric and colour under its fabric, with «У броні» (what open plans still
 * need), «Вільно» and the latest operation. Problem chips with counts instead of a banner; a pair opens its side
 * panel, where «Уточнити залишок» is a separate button.
 */
export function FabricStockPage() {
  const stock = useGetFabricStockQuery();
  const [search, setSearch] = useState('');
  const [problem, setProblem] = useState<StockProblem>('all');
  const [supplier, setSupplier] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: StockSortKey; descending: boolean }>({
    key: 'name',
    descending: false,
  });
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set());
  const [closed, setClosed] = useState<ReadonlySet<string>>(() => new Set());
  const [panel, setPanel] = useState<Panel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const data = stock.data;
  const narrowed = search.trim().length > 0 || problem !== 'all' || supplier !== null;
  const bySupplier = useMemo(
    () => filterFabricStock(searchFabricStock(data?.fabrics ?? [], search), 'all', supplier),
    [data, search, supplier],
  );
  const counts = useMemo(() => stockProblemCounts(bySupplier), [bySupplier]);
  const fabrics = useMemo(
    () => sortFabricStock(filterFabricStock(bySupplier, problem, null), sort.key, sort.descending),
    [bySupplier, problem, sort],
  );
  const expanded = useMemo(
    () =>
      new Set(
        fabrics
          .map((x) => x.fabricCode)
          .filter((code) => (narrowed ? !closed.has(code) : opened.has(code))),
      ),
    [fabrics, narrowed, opened, closed],
  );
  const toggle = (code: string) => {
    const flip = (set: ReadonlySet<string>) => {
      const next = new Set(set);
      if (!next.delete(code)) next.add(code);
      return next;
    };
    if (narrowed) setClosed(flip);
    else setOpened(flip);
  };
  // Openings, receipts, issues and «Уточнити» are new records: «Створення» on «Склад тканин».
  const { canCreate } = usePageRights();
  const canMove = Boolean(data?.permissions.canMove) && canCreate;
  const saved = (text: string) => {
    setMessage(text);
    setPanel(null);
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Залишки"
        subtitle={
          data
            ? `${formatMeters(data.meters)} · ${data.pairs} пар тканина + колір · ${data.fabrics.length} тканин`
            : 'Скільки тканини лежить і скільки вже зайнято під завдання'
        }
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <WarehouseMoreMenu
              actions={[
                ...(canMove
                  ? [
                      {
                        label: 'Разова витрата',
                        secondary: 'Зразок, брак, без завдання',
                        icon: <RemoveOutlinedIcon fontSize="small" />,
                        disabled: !data,
                        onClick: () => setPanel({ kind: 'issue' }),
                      },
                      {
                        label: 'Внести початковий залишок',
                        icon: <InventoryOutlinedIcon fontSize="small" />,
                        onClick: () => setPanel({ kind: 'opening' }),
                      },
                    ]
                  : []),
                {
                  label: 'Завантажити залишки в Excel',
                  icon: <DownloadOutlinedIcon fontSize="small" />,
                  disabled: !data?.fabrics.length,
                  onClick: () =>
                    data &&
                    downloadFile(
                      stockBalancesWorkbook(data),
                      `zalyshky-tkanyn-${kyivToday()}.xlsx`,
                      XLSX_MIME_TYPE,
                    ),
                },
                ...(data?.permissions.canTransfer
                  ? [
                      {
                        label: 'Перенесення з v133',
                        secondary: 'Склад зі старого «Цеху»',
                        icon: <MoveDownOutlinedIcon fontSize="small" />,
                        divided: true,
                        onClick: () => setPanel({ kind: 'transfer' }),
                      },
                    ]
                  : []),
              ]}
            />
            {canMove && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<ContentCutOutlinedIcon />}
                  onClick={() => setPanel({ kind: 'item-issue' })}
                >
                  Видача на завдання
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => setPanel({ kind: 'receipt' })}
                >
                  Прихід
                </Button>
              </>
            )}
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
      <FabricStockFilters
        search={search}
        problem={problem}
        counts={counts}
        supplier={supplier}
        suppliers={stockSuppliers(data?.fabrics ?? [])}
        shown={fabrics.reduce((sum, x) => sum + x.colors.length, 0)}
        total={data?.pairs ?? 0}
        onSearch={setSearch}
        onProblem={setProblem}
        onSupplier={setSupplier}
      />
      {data && (
        <FabricStockTable
          fabrics={fabrics}
          filtered={narrowed}
          sort={sort}
          onSort={(key) =>
            setSort((current) => ({
              key,
              descending: current.key === key ? !current.descending : key !== 'name',
            }))
          }
          expanded={expanded}
          onToggle={toggle}
          onOpen={(pair) => setPanel({ kind: 'pair', pair })}
        />
      )}
      {panel?.kind === 'pair' && (
        <FabricStockPairDrawer
          pair={panel.pair}
          canMove={canMove}
          onClose={() => setPanel(null)}
          onAdjust={(pair) => setPanel({ kind: 'adjust', pair })}
          onReceive={() => setPanel({ kind: 'receipt' })}
        />
      )}
      {panel?.kind === 'adjust' && (
        <FabricAdjustmentDrawer
          key={`${panel.pair.fabric.fabricCode}|${panel.pair.color.colorKey}`}
          pair={panel.pair}
          onClose={() => setPanel(null)}
          onSaved={saved}
        />
      )}
      {panel?.kind === 'receipt' && (
        <FabricReceiptDrawer onClose={() => setPanel(null)} onSaved={setMessage} />
      )}
      {panel?.kind === 'issue' && data && (
        <FabricIssueDrawer fabrics={data.fabrics} onClose={() => setPanel(null)} onSaved={saved} />
      )}
      {panel?.kind === 'item-issue' && (
        <IssueToItemDrawer onClose={() => setPanel(null)} onMessage={setMessage} />
      )}
      {panel?.kind === 'opening' && (
        <FabricOpeningDrawer onClose={() => setPanel(null)} onSaved={setMessage} />
      )}
      {panel?.kind === 'transfer' && <StockTransferDrawer onClose={() => setPanel(null)} />}
    </Box>
  );
}

export default FabricStockPage;

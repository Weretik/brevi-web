import { kyivToday, stockBalancesWorkbook, XLSX_MIME_TYPE } from '@admin/warehouse/model';
import { WarehouseMoreMenu } from '@admin/warehouse/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import MoveDownOutlinedIcon from '@mui/icons-material/MoveDownOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Button, Stack } from '@mui/material';

import { downloadFile } from '../../hooks/files/download-file';

import type { useFabricStockPage } from '../../hooks/stock/use-fabric-stock-page';

interface Props {
  page: ReturnType<typeof useFabricStockPage>;
}

/** Header of «Залишки»: «⋯» (one-off issue, opening balance, Excel, v133 transfer), «Видача на завдання», «Прихід». */
export function FabricStockActions({ page }: Props) {
  const { data, canMove, setPanel } = page;
  return (
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
  );
}

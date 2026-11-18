import { WarehouseMoreMenu } from '@admin/warehouse/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Button, Stack } from '@mui/material';

import type { FabricMovementPanel } from './fabric-movement-panels';

interface Props {
  /** New operations are allowed. */
  canMove: boolean;
  stockReady: boolean;
  exporting: boolean;
  canExport: boolean;
  onPanel: (panel: FabricMovementPanel) => void;
  onExport: () => void;
}

/** Header of «Рух тканини»: «⋯» (one-off issue, opening balance, Excel), «Видача на завдання», «Новий прихід». */
export function FabricMovementsActions({
  canMove,
  stockReady,
  exporting,
  canExport,
  onPanel,
  onExport,
}: Props) {
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
                  disabled: !stockReady,
                  onClick: () => onPanel({ kind: 'issue' }),
                },
                {
                  label: 'Внести початковий залишок',
                  icon: <InventoryOutlinedIcon fontSize="small" />,
                  onClick: () => onPanel({ kind: 'opening' }),
                },
              ]
            : []),
          {
            label: exporting ? 'Збираю сторінки…' : 'Вивантажити рух в Excel',
            icon: <DownloadOutlinedIcon fontSize="small" />,
            disabled: exporting || !canExport,
            onClick: onExport,
          },
        ]}
      />
      {canMove && (
        <>
          <Button
            variant="outlined"
            startIcon={<ContentCutOutlinedIcon />}
            onClick={() => onPanel({ kind: 'item-issue' })}
          >
            Видача на завдання
          </Button>
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => onPanel({ kind: 'receipt' })}
          >
            Новий прихід
          </Button>
        </>
      )}
    </Stack>
  );
}

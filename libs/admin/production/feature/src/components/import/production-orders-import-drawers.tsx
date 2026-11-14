import {
  useImportProductionOrdersMutation,
  useImportProductionProgressMutation,
  useImportProductionReportPricesMutation,
} from '@admin/production/data-access';
import {
  parseProductionOrderImportFile,
  parseProductionProgressImportFile,
  parseProductionReportPriceImportFile,
} from '@admin/production/model';

import { ProductionImportDrawer } from './production-import-drawer';

import type { ProductionOrdersImport } from '@admin/production/ui';

interface Props {
  kind: ProductionOrdersImport | null;
  onClose: () => void;
}

/** The one-time transfers from the old «Цех» behind «⋯» on «Виробничі завдання»: orders, stages, КП prices. */
export function ProductionOrdersImportDrawers({ kind, onClose }: Props) {
  const [importOrders] = useImportProductionOrdersMutation();
  const [importProgress] = useImportProductionProgressMutation();
  const [importPrices] = useImportProductionReportPricesMutation();

  if (kind === 'progress')
    return (
      <ProductionImportDrawer
        title="Імпорт етапів"
        description="Файл production-progress.json зі старого «Цеху»: етапи позицій, посилання на файли і відмітки Telegram. Спершу перевіримо, потім збережемо."
        keyLabel="Завдання"
        detailLabel="Що зміниться"
        parse={parseProductionProgressImportFile}
        send={(rows, dryRun) => importProgress({ rows, dryRun }).unwrap()}
        onClose={onClose}
      />
    );
  if (kind === 'prices')
    return (
      <ProductionImportDrawer
        title="Ціни КП"
        description="Файл production-report-prices.json: ціни КП для завдань зі старого «Цеху», щоб «Звіти цеху» рахували вартість випуску. Ціну отримає лише позиція без ціни. Спершу перевіримо, потім збережемо."
        keyLabel="Завдання"
        detailLabel="Що зміниться"
        parse={parseProductionReportPriceImportFile}
        send={(rows, dryRun) => importPrices({ rows, dryRun }).unwrap()}
        onClose={onClose}
      />
    );
  if (kind === 'orders')
    return (
      <ProductionImportDrawer
        title="Імпорт завдань"
        description="Файл production-orders.json зі старого «Цеху». Спершу перевіримо, потім збережемо."
        keyLabel="Номер"
        detailLabel="Клієнт"
        parse={parseProductionOrderImportFile}
        send={(rows, dryRun) => importOrders({ rows, dryRun }).unwrap()}
        onClose={onClose}
      />
    );
  return null;
}

import {
  FinanceHistoryList,
  FinanceTransferDetails,
  FinanceTransferForm,
} from '@admin/accounting/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import { Alert, Button, Stack } from '@mui/material';

import {
  canEditTransfer,
  useFinanceTransferEditor,
} from '../../hooks/transfers/use-finance-transfer-editor';

import type { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import type { FinanceMovementEditorMode } from '../../hooks/transactions/use-finance-transaction-editor';
import type { FinanceTransfer, LedgerScope } from '@admin/accounting/model';

interface Props {
  mode: FinanceMovementEditorMode;
  transfer: FinanceTransfer | null;
  scope: LedgerScope;
  cutoverDate: string;
  date: string;
  choices: ReturnType<typeof useFinanceChoices>;
  onClose: () => void;
  onSaved: (message: string) => void;
  onVoid: (transfer: FinanceTransfer) => void;
}

const titles: Record<FinanceMovementEditorMode, string> = {
  create: 'Новий переказ',
  view: 'Переказ',
  edit: 'Редагування переказу',
};

export function FinanceTransferDrawer({ choices, onClose, onVoid, ...props }: Props) {
  const { canEdit } = usePageRights();
  const editor = useFinanceTransferEditor({ ...props, currencyOf: choices.currencyOf });
  const transfer = editor.transfer;
  const readOnly = editor.mode === 'view';
  const editable = transfer ? canEditTransfer(transfer) : true;

  return (
    <ReferenceEditorDrawer
      titleId="finance-transfer-drawer-title"
      title={titles[editor.mode]}
      description="Переказ між власними рахунками не є ні доходом, ні витратою."
      formId="finance-transfer-form"
      paperWidth={560}
      readOnly={readOnly}
      saving={editor.saving}
      editLabel={editable ? 'Редагувати' : null}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly && transfer ? (
          <>
            <FinanceTransferDetails transfer={transfer} />
            <ReferenceFormSection title="Історія змін">
              <FinanceHistoryList {...editor.history} />
            </ReferenceFormSection>
            {editable && (
              <Stack direction="row">
                {canEdit && (
                  <Button color="error" variant="outlined" onClick={() => onVoid(transfer)}>
                    Анулювати
                  </Button>
                )}
              </Stack>
            )}
          </>
        ) : (
          <FinanceTransferForm
            values={editor.values}
            errors={editor.errors}
            accounts={choices.accountChoices(
              transfer ? [transfer.fromAccountId, transfer.toAccountId] : [],
            )}
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

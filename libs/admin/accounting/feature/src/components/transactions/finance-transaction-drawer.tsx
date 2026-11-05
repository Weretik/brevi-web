import {
  FinanceHistoryList,
  FinanceTransactionDetails,
  FinanceTransactionForm,
} from '@admin/accounting/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';

import {
  canEditTransaction,
  useFinanceTransactionEditor,
} from '../../hooks/transactions/use-finance-transaction-editor';

import type { FinanceChoice, useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import type { FinanceMovementEditorMode } from '../../hooks/transactions/use-finance-transaction-editor';
import type { CategoryDirection, FinanceTransaction, LedgerScope } from '@admin/accounting/model';

interface Props {
  mode: FinanceMovementEditorMode;
  transaction: FinanceTransaction | null;
  scope: LedgerScope;
  type: CategoryDirection;
  cutoverDate: string;
  date: string;
  choices: ReturnType<typeof useFinanceChoices>;
  onClose: () => void;
  onSaved: (message: string) => void;
  onVoid: (transaction: FinanceTransaction) => void;
}

const titles: Record<FinanceMovementEditorMode, string> = {
  create: 'Нова операція',
  view: 'Операція',
  edit: 'Редагування операції',
};

const toChoices = (rows: { id: string; name: string }[]): FinanceChoice[] =>
  rows.map(({ id, name }) => ({ id, name }));

export function FinanceTransactionDrawer({
  scope,
  cutoverDate,
  date,
  choices,
  onClose,
  onSaved,
  onVoid,
  ...props
}: Props) {
  const editor = useFinanceTransactionEditor({ ...props, scope, cutoverDate, date, onSaved });
  const transaction = editor.transaction;
  const readOnly = editor.mode === 'view';
  const editable = transaction ? canEditTransaction(transaction) : true;
  const keepCategory = transaction?.categoryId ?? '';

  return (
    <ReferenceEditorDrawer
      titleId="finance-transaction-drawer-title"
      title={titles[editor.mode]}
      description={
        scope === 'Current'
          ? 'Поточний облік з 01.10.2026. Зміни потраплять в історію.'
          : 'Домашня бухгалтерія до 01.10.2026. Зміни потраплять в історію.'
      }
      formId="finance-transaction-form"
      paperWidth={600}
      readOnly={readOnly}
      saving={editor.saving}
      editLabel={editable ? 'Редагувати' : null}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {editor.notice && <Alert severity="info">{editor.notice}</Alert>}
        {readOnly && transaction ? (
          <>
            <FinanceTransactionDetails transaction={transaction} />
            <ReferenceFormSection title="Історія змін">
              <FinanceHistoryList {...editor.history} />
            </ReferenceFormSection>
            {editable && (
              <Stack direction="row">
                <Button color="error" variant="outlined" onClick={() => onVoid(transaction)}>
                  Анулювати
                </Button>
              </Stack>
            )}
          </>
        ) : (
          <FinanceTransactionForm
            values={editor.values}
            errors={editor.errors}
            accounts={choices.accountChoices(transaction ? [transaction.accountId] : [])}
            roots={toChoices(choices.categoryChoices(editor.values.type, null, keepCategory))}
            children={
              editor.values.rootId
                ? toChoices(
                    choices.categoryChoices(editor.values.type, editor.values.rootId, keepCategory),
                  )
                : []
            }
            addNext={
              transaction ? undefined : { checked: editor.addNext, onChange: editor.setAddNext }
            }
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

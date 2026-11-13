import {
  FinanceAttachmentList,
  FinanceDeleteDialog,
  FinanceHistoryList,
  FinanceTransactionDetails,
  FinanceTransactionForm,
} from '@admin/accounting/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import { Alert, Button, Stack } from '@mui/material';

import { useFinanceAttachments } from '../../hooks/attachments/use-finance-attachments';
import { useFinanceCounterpartySearch } from '../../hooks/counterparties/use-finance-counterparty-search';
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
  const { canEdit } = usePageRights();
  const editor = useFinanceTransactionEditor({
    ...props,
    scope,
    cutoverDate,
    date,
    categories: choices.categories,
    onSaved,
  });
  const counterparties = useFinanceCounterpartySearch(editor.mode !== 'view', (choice) =>
    editor.change('counterparty', choice),
  );
  const transaction = editor.transaction;
  const attachments = useFinanceAttachments(transaction);
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
        {counterparties.error && <Alert severity="error">{counterparties.error}</Alert>}
        {editor.notice && <Alert severity="info">{editor.notice}</Alert>}
        {readOnly && transaction ? (
          <>
            <FinanceTransactionDetails transaction={transaction} />
            <ReferenceFormSection title="Файли">
              <FinanceAttachmentList {...attachments.list} />
            </ReferenceFormSection>
            <ReferenceFormSection title="Історія змін">
              <FinanceHistoryList {...editor.history} />
            </ReferenceFormSection>
            {editable && (
              <Stack direction="row">
                {canEdit && (
                  <Button color="error" variant="outlined" onClick={() => onVoid(transaction)}>
                    Анулювати
                  </Button>
                )}
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
            counterpartySearch={counterparties.field}
            addNext={
              transaction ? undefined : { checked: editor.addNext, onChange: editor.setAddNext }
            }
            onChange={editor.change}
          />
        )}
      </Stack>
      <FinanceDeleteDialog
        open={Boolean(attachments.pendingDelete)}
        title="Видалити файл?"
        text={
          attachments.pendingDelete
            ? `«${attachments.pendingDelete.fileName}» зникне з операції і зі сховища. В історії залишиться запис про це.`
            : ''
        }
        deleting={attachments.deleting}
        onClose={attachments.cancelDelete}
        onConfirm={attachments.confirmDelete}
      />
    </ReferenceEditorDrawer>
  );
}

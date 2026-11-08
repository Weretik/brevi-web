import { bankLineLocked } from '@admin/accounting/model';
import { BankLineDetails, BankLineForm } from '@admin/accounting/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useFinanceCounterpartySearch } from '../../hooks/counterparties/use-finance-counterparty-search';
import { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import { useBankLineEditor } from '../../hooks/statements/use-bank-line-editor';

import type { BankStatementLine } from '@admin/accounting/model';

interface Props {
  statementId: string;
  line: BankStatementLine;
  /** A booked statement: the bank data only, nothing to change. */
  readOnly: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** One statement line in the side panel: the bank data above, the director's choice below. */
export function BankLineDrawer({ statementId, line, readOnly, onClose, onSaved }: Props) {
  const choices = useFinanceChoices('Current');
  const editor = useBankLineEditor(statementId, line, choices.categories, onSaved);
  const counterparties = useFinanceCounterpartySearch(!readOnly, (choice) =>
    editor.change('counterparty', choice),
  );
  const keep = line.categoryId ?? '';
  const type = line.type ?? 'Expense';

  return (
    <ReferenceEditorDrawer
      titleId="bank-line-drawer-title"
      title={`Рядок ${line.rowNumber}`}
      description={
        readOnly
          ? 'Виписку проведено; рядок лише для перегляду.'
          : 'Дані банку не змінюються; оберіть, як провести рядок.'
      }
      formId="bank-line-form"
      paperWidth={600}
      readOnly={readOnly}
      editLabel={null}
      saving={editor.saving}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {counterparties.error && <Alert severity="error">{counterparties.error}</Alert>}
        <BankLineDetails line={line} />
        {!readOnly && (
          <ReferenceFormSection title="Як провести">
            <BankLineForm
              values={editor.values}
              errors={editor.errors}
              transfer={Boolean(line.transferAccountId)}
              locked={bankLineLocked(line)}
              roots={choices.categoryChoices(type, null, keep)}
              children={
                editor.values.rootId
                  ? choices.categoryChoices(type, editor.values.rootId, keep)
                  : []
              }
              counterpartySearch={counterparties.field}
              onChange={editor.change}
            />
          </ReferenceFormSection>
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

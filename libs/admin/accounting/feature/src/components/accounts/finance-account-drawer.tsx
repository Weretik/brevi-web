import {
  FinanceAccountDetails,
  FinanceAccountForm,
  FinanceCutoverForm,
  FinanceHistoryList,
} from '@admin/accounting/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';

import { useFinanceAccountEditor } from '../../hooks/accounts/use-finance-account-editor';

import type { FinanceAccountEditorMode } from '../../hooks/accounts/use-finance-account-editor';
import type { FinanceAccount } from '@admin/accounting/model';

interface Props {
  mode: FinanceAccountEditorMode;
  account: FinanceAccount | null;
  cutoverDate: string;
  today: string;
  newSortOrder: number;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const titles: Record<FinanceAccountEditorMode, string> = {
  create: 'Новий рахунок',
  view: 'Рахунок',
  edit: 'Редагування рахунку',
  cutover: 'Залишок на 01.10',
};

const descriptions: Record<FinanceAccountEditorMode, string> = {
  create: 'Банківський рахунок, картка або каса.',
  view: 'Перевірте рахунок або перейдіть до редагування.',
  edit: 'Зміни потраплять в історію рахунку.',
  cutover: 'Підтверджений залишок — початок поточного обліку.',
};

export function FinanceAccountDrawer({
  mode: initialMode,
  account: initialAccount,
  cutoverDate,
  today,
  newSortOrder,
  onClose,
  onSaved,
}: Props) {
  const editor = useFinanceAccountEditor(initialMode, initialAccount, today, newSortOrder, onSaved);
  const account = editor.account;
  const readOnly = editor.mode === 'view';
  const confirmed = Boolean(account?.cutoverConfirmed);

  return (
    <ReferenceEditorDrawer
      titleId="finance-account-drawer-title"
      title={titles[editor.mode]}
      description={descriptions[editor.mode]}
      formId="finance-account-form"
      paperWidth={560}
      readOnly={readOnly}
      saving={editor.saving}
      submitLabel={editor.mode === 'cutover' ? 'Підтвердити' : 'Зберегти'}
      onClose={editor.mode === 'cutover' && initialMode !== 'cutover' ? editor.backToView : onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {editor.mode === 'cutover' && account ? (
          <FinanceCutoverForm
            accountName={account.name}
            cutoverDate={cutoverDate}
            values={editor.cutover}
            error={editor.cutoverError}
            onChange={editor.changeCutover}
          />
        ) : readOnly && account ? (
          <>
            <FinanceAccountDetails
              account={account}
              cutoverDate={cutoverDate}
              cutoverActions={
                account.active && (
                  <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      disabled={editor.saving}
                      onClick={editor.openCutover}
                    >
                      {confirmed ? 'Змінити залишок' : 'Підтвердити залишок'}
                    </Button>
                    {confirmed && (
                      <Button disabled={editor.saving} onClick={() => void editor.clearCutover()}>
                        Скасувати підтвердження
                      </Button>
                    )}
                  </Stack>
                )
              }
            />
            <ReferenceFormSection title="Історія змін">
              <FinanceHistoryList {...editor.history} />
            </ReferenceFormSection>
            <Stack direction="row">
              <Button
                color={account.active ? 'inherit' : 'primary'}
                variant="outlined"
                disabled={editor.saving}
                onClick={() => void editor.toggleActive()}
              >
                {account.active ? 'Перенести в архів' : 'Відновити з архіву'}
              </Button>
            </Stack>
          </>
        ) : (
          <FinanceAccountForm
            values={editor.values}
            errors={editor.errors}
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

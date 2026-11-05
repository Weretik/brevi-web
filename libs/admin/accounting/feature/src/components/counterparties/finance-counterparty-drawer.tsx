import { useGetFinanceCounterpartiesQuery } from '@admin/accounting/data-access';
import { financeCounterpartyCategoryChoices } from '@admin/accounting/model';
import {
  FinanceCounterpartyDetails,
  FinanceCounterpartyForm,
  FinanceHistoryList,
  FinanceMergeDialog,
} from '@admin/accounting/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useDeferredValue, useState } from 'react';

import { useFinanceCounterpartyEditor } from '../../hooks/counterparties/use-finance-counterparty-editor';

import type { FinanceCounterpartyEditorMode } from '../../hooks/counterparties/use-finance-counterparty-editor';
import type { FinanceCategory, FinanceCounterparty } from '@admin/accounting/model';

interface Props {
  mode: FinanceCounterpartyEditorMode;
  counterparty: FinanceCounterparty | null;
  categories: FinanceCategory[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

const titles: Record<FinanceCounterpartyEditorMode, string> = {
  create: 'Новий контрагент',
  view: 'Контрагент',
  edit: 'Редагування контрагента',
};

export function FinanceCounterpartyDrawer({
  mode,
  counterparty,
  categories,
  onClose,
  onSaved,
}: Props) {
  const editor = useFinanceCounterpartyEditor(mode, counterparty, categories, onSaved);
  const current = editor.counterparty;
  const readOnly = editor.mode === 'view';
  const keep = current?.defaultCategoryId ?? '';
  const [merging, setMerging] = useState(false);
  const [mergeText, setMergeText] = useState('');
  const mergeSearch = useDeferredValue(mergeText.trim());
  const targets = useGetFinanceCounterpartiesQuery(
    { tab: 'Financial', page: 1, ...(mergeSearch ? { search: mergeSearch } : {}) },
    { skip: !merging },
  );
  const editable = Boolean(current && !current.mergedIntoId);

  return (
    <ReferenceEditorDrawer
      titleId="finance-counterparty-drawer-title"
      title={titles[editor.mode]}
      description={
        readOnly
          ? 'Фінансовий контрагент «Бухгалтерії». Зміни потраплять в історію.'
          : 'Новий контрагент спершу не підтверджений; його операції потребують перевірки.'
      }
      formId="finance-counterparty-form"
      paperWidth={600}
      readOnly={readOnly}
      saving={editor.saving}
      editLabel={editable || !current ? 'Редагувати' : null}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {editor.notice && <Alert severity="info">{editor.notice}</Alert>}
        {readOnly && current ? (
          <>
            <FinanceCounterpartyDetails counterparty={current} />
            {editable && (
              <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
                {current.active && !current.verified && (
                  <Button variant="contained" disabled={editor.busy} onClick={editor.verify}>
                    Підтвердити
                  </Button>
                )}
                {current.active && (
                  <Button
                    variant="outlined"
                    disabled={editor.busy}
                    onClick={() => setMerging(true)}
                  >
                    Обʼєднати з іншим
                  </Button>
                )}
                {current.active ? (
                  <Button
                    color="error"
                    variant="outlined"
                    disabled={editor.busy}
                    onClick={editor.archive}
                  >
                    Архівувати
                  </Button>
                ) : (
                  <Button variant="outlined" disabled={editor.busy} onClick={editor.restore}>
                    Відновити
                  </Button>
                )}
              </Stack>
            )}
            <ReferenceFormSection title="Історія змін">
              <FinanceHistoryList {...editor.history} />
            </ReferenceFormSection>
          </>
        ) : (
          <FinanceCounterpartyForm
            values={editor.values}
            errors={editor.errors}
            roots={financeCounterpartyCategoryChoices(categories, null, keep)}
            children={
              editor.values.rootId
                ? financeCounterpartyCategoryChoices(categories, editor.values.rootId, keep)
                : []
            }
            verified={current?.verified ?? false}
            onChange={editor.change}
          />
        )}
      </Stack>
      {current && (
        <FinanceMergeDialog
          open={merging}
          sourceName={current.name}
          options={(targets.data?.financial ?? []).filter(
            (row) => row.id !== current.id && row.active && !row.mergedIntoId,
          )}
          loading={targets.isFetching}
          merging={editor.busy}
          onSearch={setMergeText}
          onClose={() => setMerging(false)}
          onConfirm={(target) => void editor.mergeInto(target).then(() => setMerging(false))}
        />
      )}
    </ReferenceEditorDrawer>
  );
}

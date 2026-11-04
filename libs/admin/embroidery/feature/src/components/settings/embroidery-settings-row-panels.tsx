import {
  embroideryGlueExpenseId,
  validateEmbroideryExpense,
  validateEmbroideryHoop,
} from '@admin/embroidery/model';
import { EmbroideryExpenseForm, EmbroideryHoopForm } from '@admin/embroidery/ui';

import { EmbroideryRowDrawer } from './embroidery-row-drawer';

import type { EmbroiderySettingsEditor } from '../../hooks/settings/use-embroidery-settings-editor';
import type {
  EmbroideryExpenseDraft,
  EmbroideryHoopDraft,
  EmbroiderySettingsDraft,
} from '@admin/embroidery/model';

export type EmbroiderySettingsOpenRow =
  | { kind: 'hoop'; row: EmbroideryHoopDraft; isNew: boolean }
  | { kind: 'expense'; row: EmbroideryExpenseDraft; isNew: boolean }
  | null;

interface Props {
  open: EmbroiderySettingsOpenRow;
  draft: EmbroiderySettingsDraft;
  editor: EmbroiderySettingsEditor;
  onClose: () => void;
}

/** The side panel of the open «П’яльця» or «Додаткові витрати» row. */
export function EmbroiderySettingsRowPanels({ open, draft, editor, onClose }: Props) {
  return (
    <>
      {open?.kind === 'hoop' && (
        <EmbroideryRowDrawer
          key={open.row.id}
          title={open.isNew ? 'Нові п’яльця' : open.row.label || 'П’яльця'}
          description="Розмір заготовки флізеліну для одного зап’ялювання."
          formId="embroidery-hoop-form"
          initial={open.row}
          validate={(row) =>
            validateEmbroideryHoop(
              row,
              draft.hoops.filter((hoop) => hoop.id !== row.id),
            )
          }
          removeLabel={open.isNew ? null : 'Прибрати п’яльця'}
          form={({ row, errors: rowErrors, change, submit }) => (
            <EmbroideryHoopForm
              formId="embroidery-hoop-form"
              hoop={row}
              errors={rowErrors}
              onChange={change}
              onSubmit={submit}
            />
          )}
          onClose={onClose}
          onDone={(row) => {
            editor.putHoop(row);
            onClose();
          }}
          onRemove={() => {
            editor.removeHoop(open.row.id);
            onClose();
          }}
        />
      )}
      {open?.kind === 'expense' && (
        <EmbroideryRowDrawer
          key={open.row.id}
          title={open.isNew ? 'Нова стаття' : open.row.name || 'Стаття'}
          description="Додаткова витрата, яку можна зняти в окремому розрахунку."
          formId="embroidery-expense-form"
          initial={open.row}
          validate={validateEmbroideryExpense}
          removeLabel={
            open.isNew || open.row.id === embroideryGlueExpenseId ? null : 'Прибрати статтю'
          }
          form={({ row, errors: rowErrors, change, submit }) => (
            <EmbroideryExpenseForm
              formId="embroidery-expense-form"
              expense={row}
              errors={rowErrors}
              onChange={change}
              onSubmit={submit}
            />
          )}
          onClose={onClose}
          onDone={(row) => {
            editor.putExpense(row);
            onClose();
          }}
          onRemove={() => {
            editor.removeExpense(open.row.id);
            onClose();
          }}
        />
      )}
    </>
  );
}

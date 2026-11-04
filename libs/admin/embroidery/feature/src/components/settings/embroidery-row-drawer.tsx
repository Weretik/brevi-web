import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { ReactNode } from 'react';

interface Props<Row> {
  title: string;
  description: string;
  formId: string;
  initial: Row;
  /** Field problems of the row being typed. */
  validate: (row: Row) => Record<string, string>;
  /** Null hides «Прибрати» (a new row, or a row the page needs). */
  removeLabel: string | null;
  form: (props: {
    row: Row;
    errors: Record<string, string>;
    change: (patch: Partial<Row>) => void;
    submit: () => void;
  }) => ReactNode;
  onClose: () => void;
  onDone: (row: Row) => void;
  onRemove: () => void;
}

/**
 * One row of «П’яльця» or «Додаткові витрати» in the reference side panel. «Готово» puts the row into the
 * page's draft; nothing reaches the server until «Зберегти» at the bottom of the page.
 */
export function EmbroideryRowDrawer<Row>({
  title,
  description,
  formId,
  initial,
  validate,
  removeLabel,
  form,
  onClose,
  onDone,
  onRemove,
}: Props<Row>) {
  const [row, setRow] = useState(initial);
  const [showErrors, setShowErrors] = useState(false);
  const errors = showErrors ? validate(row) : {};
  const submit = () => {
    setShowErrors(true);
    if (Object.keys(validate(row)).length === 0) onDone(row);
  };
  return (
    <ReferenceEditorDrawer
      titleId={`${formId}-title`}
      title={title}
      description={description}
      formId={formId}
      paperWidth={440}
      readOnly={false}
      saving={false}
      submitLabel="Готово"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={submit}
    >
      <Stack sx={{ gap: 3 }}>
        {form({
          row,
          errors,
          change: (patch) => setRow((current) => ({ ...current, ...patch })),
          submit,
        })}
        <Typography variant="caption" color="text.secondary">
          Зміни запишуться, коли ви натиснете «Зберегти» внизу сторінки.
        </Typography>
        {removeLabel && (
          <Button
            color="error"
            variant="outlined"
            onClick={onRemove}
            sx={{ alignSelf: 'flex-start' }}
          >
            {removeLabel}
          </Button>
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

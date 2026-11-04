import { useCreateQuoteIntroTemplateMutation } from '@admin/quotes/data-access';
import { quoteIntroTemplateNameError, quoteIntroTemplateNameMax } from '@admin/quotes/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, TextField } from '@mui/material';
import { useState } from 'react';

import type { QuoteIntroDraft } from '@admin/quotes/model';

interface Props {
  draft: QuoteIntroDraft;
  onClose: () => void;
  onSaved: (name: string) => void;
}

/** «Зберегти як готовий шаблон»: the layout, letter, models and fabrics under a name, without prices. */
export function QuoteIntroTemplateSaveDrawer({ draft, onClose, onSaved }: Props) {
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [create, creating] = useCreateQuoteIntroTemplateMutation();
  const nameError = touched ? quoteIntroTemplateNameError(name) : null;

  return (
    <ReferenceEditorDrawer
      titleId="quote-intro-template-save-title"
      title="Зберегти як шаблон"
      description="Шаблон побачать усі менеджери. Ціни в ньому не зберігаються."
      formId="quote-intro-template-save-form"
      paperWidth={440}
      readOnly={false}
      saving={creating.isLoading}
      submitLabel="Зберегти шаблон"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={async () => {
        setTouched(true);
        setError(null);
        if (quoteIntroTemplateNameError(name)) return;
        try {
          const saved = await create({ name, draft }).unwrap();
          onSaved(saved.name);
        } catch (cause) {
          setError((cause as { message?: string }).message ?? 'Не вдалося зберегти шаблон.');
        }
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        fullWidth
        size="small"
        label="Назва шаблону"
        placeholder="Наприклад: Агро база"
        value={name}
        error={Boolean(nameError)}
        helperText={nameError}
        onChange={(event) => setName(event.target.value)}
        slotProps={{ htmlInput: { maxLength: quoteIntroTemplateNameMax } }}
      />
    </ReferenceEditorDrawer>
  );
}

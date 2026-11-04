import { QuoteSettingsField } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import type { QuoteSettingsErrors, QuoteStaffContactDraft } from '@admin/quotes/model';

interface Props {
  contact: QuoteStaffContactDraft;
  errors: QuoteSettingsErrors;
  onClose: () => void;
  /** Puts the fields into the page; they are saved with «Зберегти» of the page. */
  onDone: (patch: Pick<QuoteStaffContactDraft, 'name' | 'phone' | 'email'>) => void;
}

/** A manager as the client sees them in the КП: name, phone and email; empty ones come from the account. */
export function QuoteManagerDrawer({ contact, errors, onClose, onDone }: Props) {
  const [fields, setFields] = useState({
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
  });
  const at = (field: string) => errors[`staff:${contact.userId}.${field}`];
  return (
    <ReferenceEditorDrawer
      titleId="quote-manager-title"
      title={`${contact.accountName} у КП`}
      description={`Обліковий запис: ${contact.accountEmail}`}
      formId="quote-manager-form"
      paperWidth={440}
      readOnly={false}
      saving={false}
      saveDisabled={!fields.name.trim()}
      submitLabel="Готово"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => onDone(fields)}
    >
      <Stack sx={{ gap: 2 }}>
        <QuoteSettingsField
          required
          label="Ім'я в КП"
          value={fields.name}
          error={at('name')}
          onChange={(name) => setFields((current) => ({ ...current, name }))}
        />
        <QuoteSettingsField
          label="Телефон"
          placeholder="Як в обліковому записі"
          value={fields.phone}
          error={at('phone')}
          onChange={(phone) => setFields((current) => ({ ...current, phone }))}
        />
        <QuoteSettingsField
          label="Email"
          placeholder={contact.accountEmail}
          value={fields.email}
          error={at('email')}
          onChange={(email) => setFields((current) => ({ ...current, email }))}
        />
        <Alert severity="info" variant="outlined">
          Gmail для надсилання підключають кнопкою в рядку менеджера: людина сама входить у свою
          пошту Google. Зміни тут зберігаються кнопкою «Зберегти» внизу сторінки.
        </Alert>
      </Stack>
    </ReferenceEditorDrawer>
  );
}

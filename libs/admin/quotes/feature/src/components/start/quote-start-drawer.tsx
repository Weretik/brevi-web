import { quoteStartPaths, quoteStartPrefillOf } from '@admin/quotes/model';
import { QuoteStartForm } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useClientSuggestions } from '../../hooks/clients/use-client-suggestions';

import type { QuoteClientSuggestion, QuoteStartKind } from '@admin/quotes/model';

/** «Нове КП» side panel: pick the client and the kind, then open the editor with them filled in. */
export function QuoteStartDrawer({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const suggestions = useClientSuggestions();
  const [name, setName] = useState('');
  const [client, setClient] = useState<QuoteClientSuggestion | null>(null);
  const [kind, setKind] = useState<QuoteStartKind>('Request');
  const [tried, setTried] = useState(false);
  const nameError = tried && !name.trim() ? 'Вкажіть клієнта або назву запиту.' : undefined;

  return (
    <ReferenceEditorDrawer
      titleId="quote-start-title"
      title="Нове КП"
      description="Для кого і що готуємо. Усе інше — вже в самому КП."
      formId="quote-start-form"
      paperWidth={520}
      readOnly={false}
      saving={false}
      submitLabel="Створити КП"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => {
        setTried(true);
        if (!name.trim()) return;
        navigate(quoteStartPaths[kind], {
          state: { prefill: quoteStartPrefillOf(name, client) },
        });
      }}
    >
      <QuoteStartForm
        name={name}
        client={client}
        clients={suggestions.clients}
        kind={kind}
        nameError={nameError}
        onNameChange={(value) => {
          setName(value);
          suggestions.search(value);
        }}
        onClientChange={setClient}
        onKindChange={setKind}
      />
    </ReferenceEditorDrawer>
  );
}

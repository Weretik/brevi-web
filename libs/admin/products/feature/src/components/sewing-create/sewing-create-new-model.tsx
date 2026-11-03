import { sewingCreateChecklist } from '@admin/products/model';
import { SewingCreateLayout, SewingModelForm } from '@admin/products/ui';
import { useListProductSectionsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Button } from '@mui/material';
import { useMemo } from 'react';

import { SewingCreateSidePanel } from './sewing-create-side-panel';
import { useSewingModelForm } from '../../hooks/sewing-create/use-sewing-model-form';

interface Props {
  listHref: string;
  onCreated: (id: number) => void;
  onExit: () => void;
}

const emptyChecks = sewingCreateChecklist({ articles: null, operations: null });

/** Step 1 before the draft exists; «Далі» saves the model as an inactive draft. */
export function SewingCreateNewModel({ listHref, onCreated, onExit }: Props) {
  const form = useSewingModelForm();
  const sectionsResult = useListProductSectionsQuery();
  const sections = useMemo(
    () => (sectionsResult.data ?? []).filter((section) => section.type === 'Sewing'),
    [sectionsResult.data],
  );

  const create = async (after: (id: number) => void) => {
    const id = await form.submit();
    if (id !== null) after(id);
  };

  return (
    <SewingCreateLayout
      listHref={listHref}
      name={null}
      code={null}
      step={1}
      ready={false}
      stepper={{ done: [], canOpen: (step) => step === 1, onSelect: () => undefined }}
      exitDisabled={form.creating}
      onExit={() => {
        const filled = form.values.name.trim() || form.values.sectionId !== '';
        if (filled) void create(onExit);
        else onExit();
      }}
      onBack={null}
      next={{
        label: 'Далі',
        busy: form.creating,
        disabled: false,
        onClick: () => void create(onCreated),
      }}
      side={<SewingCreateSidePanel step={1} checks={emptyChecks} labour={null} />}
    >
      {sectionsResult.isError && (
        <Alert
          severity="error"
          action={<Button onClick={() => void sectionsResult.refetch()}>Повторити</Button>}
        >
          {adminApiErrorMessage(sectionsResult.error, 'Не вдалося завантажити розділи.')}
        </Alert>
      )}
      {form.message && <Alert severity="error">{form.message}</Alert>}
      <SewingModelForm
        values={form.values}
        errors={form.errors}
        sections={sections}
        checkingCode={form.checkingCode}
        codeNote={form.codeNote}
        disabled={form.creating}
        onChange={form.change}
      />
    </SewingCreateLayout>
  );
}

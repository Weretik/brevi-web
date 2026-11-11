import { emptyManager } from '@admin/content/model';
import { SiteCompanyForm } from '@admin/content/ui';
import { MediaPickerDrawer } from '@admin/media/feature';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import { useSiteCompanyEditor } from '../../hooks/company/use-site-company-editor';

import type { SiteCompany } from '@admin/content/model';

interface Props {
  company: SiteCompany;
  onClose: () => void;
  /** Saved: the panel closes and the page shows the text. */
  onDone: (text: string) => void;
}

/** The form of «Контакти та компанія» in the «Цех» side panel; manager photos come from «Фото». */
export function SiteCompanyDrawer({ company, onClose, onDone }: Props) {
  const editor = useSiteCompanyEditor(company, onDone);
  const [pickingFor, setPickingFor] = useState<number | null>(null);

  return (
    <>
      <ReferenceEditorDrawer
        titleId="site-company-drawer-title"
        title="Контакти та компанія"
        description="Те, що сайт показує про компанію: у шапці, підвалі, на сторінках «Контакти» й «Доставка та оплата» і для пошукових систем."
        formId="site-company-form"
        paperWidth={680}
        readOnly={false}
        saving={editor.saving}
        submitLabel="Зберегти"
        editLabel={null}
        onClose={onClose}
        onEdit={() => undefined}
        onSubmit={editor.submit}
      >
        <Stack sx={{ gap: 2 }}>
          {editor.message && <Alert severity="error">{editor.message}</Alert>}
          <SiteCompanyForm
            values={editor.values}
            errors={editor.errors}
            disabled={editor.saving}
            onChange={editor.change}
            onPickPhoto={setPickingFor}
            onAddManager={() =>
              editor.change({
                ...editor.values,
                managers: [...editor.values.managers, emptyManager()],
              })
            }
          />
        </Stack>
      </ReferenceEditorDrawer>
      {pickingFor !== null && (
        <MediaPickerDrawer
          alreadyAddedIds={[]}
          onClose={() => setPickingFor(null)}
          onPick={(files) => {
            const index = pickingFor;
            setPickingFor(null);
            const file = files[0];
            if (!file) return;
            editor.change({
              ...editor.values,
              managers: editor.values.managers.map((m, i) =>
                i === index ? { ...m, photoUrl: file.publicUrl } : m,
              ),
            });
          }}
        />
      )}
    </>
  );
}

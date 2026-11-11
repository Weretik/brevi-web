import { SeoSettingsForm } from '@admin/content/ui';
import { MediaPickerDrawer } from '@admin/media/feature';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import { useSeoSettingsEditor } from '../../hooks/seo-settings/use-seo-settings-editor';

import type { SeoSettings } from '@admin/content/model';

interface Props {
  settings: SeoSettings;
  onClose: () => void;
  /** Saved: the panel closes and the page shows the text. */
  onDone: (text: string) => void;
}

/** The form of «Налаштування SEO сайту» in the «Цех» side panel; the picture comes from «Фото». */
export function SeoSettingsDrawer({ settings, onClose, onDone }: Props) {
  const editor = useSeoSettingsEditor(settings, onDone);
  const [picking, setPicking] = useState(false);

  return (
    <>
      <ReferenceEditorDrawer
        titleId="seo-settings-drawer-title"
        title="Налаштування SEO сайту"
        description="Коди, які сайт додає на кожну сторінку. Їх видають Google і Bing; порожнє поле нічого не додає."
        formId="seo-settings-form"
        paperWidth={560}
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
          <SeoSettingsForm
            values={editor.values}
            errors={editor.errors}
            disabled={editor.saving}
            onChange={editor.change}
            onPickPicture={() => setPicking(true)}
          />
        </Stack>
      </ReferenceEditorDrawer>
      {picking && (
        <MediaPickerDrawer
          alreadyAddedIds={[]}
          onClose={() => setPicking(false)}
          onPick={(files) => {
            setPicking(false);
            const file = files[0];
            if (!file) return;
            editor.change({
              ...editor.values,
              picture: {
                photoId: file.id,
                url: file.publicUrl,
                width: file.width ?? null,
                height: file.height ?? null,
              },
            });
          }}
        />
      )}
    </>
  );
}

import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { CustomReloadAction } from './custom-reload-action';

import type { useCustomEditor } from '../../../hooks/custom-sewing/use-custom-editor';
import type { CustomDetail } from '@admin/clients/model';

type EditorActions = Pick<
  ReturnType<typeof useCustomEditor>,
  'detail' | 'pending' | 'uncertain' | 'retryAction' | 'dirty' | 'act' | 'refresh'
>;

/** Action availability and preview expiry; request ownership stays in the editor hook. */
export function CustomEditorActions({
  editor,
  blocked,
  reload,
}: {
  editor: EditorActions;
  blocked: boolean;
  reload?: () => Promise<CustomDetail>;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 3000);
    return () => clearInterval(timer);
  }, []);
  const preview = editor.dirty ? null : editor.detail?.preview;
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
      <Button
        variant="contained"
        disabled={
          editor.pending ||
          blocked ||
          editor.detail?.canEdit === false ||
          (editor.uncertain && editor.retryAction !== 'save')
        }
        onClick={() => void editor.act('save')}
      >
        Зберегти конфігурацію
      </Button>
      <Button
        disabled={
          editor.pending ||
          blocked ||
          (editor.uncertain
            ? editor.retryAction !== 'calculate'
            : !editor.detail || editor.dirty || editor.detail.canEdit === false)
        }
        onClick={() => void editor.act('calculate')}
      >
        Розрахувати на сервері
      </Button>
      <Button
        disabled={
          editor.pending ||
          blocked ||
          (editor.uncertain
            ? editor.retryAction !== 'version'
            : editor.dirty ||
              !preview?.isCalculated ||
              preview.blockers.length > 0 ||
              preview.expiresAt <= now ||
              editor.detail?.canEdit === false)
        }
        onClick={() => void editor.act('version')}
      >
        Зберегти незмінну версію
      </Button>
      {reload && (
        <CustomReloadAction
          disabled={editor.pending || editor.uncertain || blocked}
          onReload={() => editor.refresh(reload)}
        />
      )}
    </Stack>
  );
}

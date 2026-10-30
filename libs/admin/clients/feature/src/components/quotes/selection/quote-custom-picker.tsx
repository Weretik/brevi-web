import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';

import { QuoteCustomEditorState } from './quote-custom-editor-state';
import { CustomWorkspace } from '../../custom-sewing/editor/custom-workspace';

import type { QuotePriceSelection } from '@admin/clients/model';

export function QuoteCustomPicker({
  selection,
  disabled,
  onChange,
}: {
  selection: Extract<QuotePriceSelection, { kind: 'customSewing' }>;
  disabled: boolean;
  onChange: (selection: QuotePriceSelection) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [knownId, setKnownId] = useState(selection.draftId);
  const report = useContext(QuoteCustomEditorState);
  const state = useCallback(
    (changed: boolean, locked: boolean) => {
      setDirty(changed);
      setBusy(locked);
      report?.(changed, locked);
    },
    [report],
  );
  useEffect(() => () => report?.(false, false), [report]);
  const close = () => {
    if (busy) return;
    if (dirty) setConfirm(true);
    else setOpen(false);
  };
  return (
    <Stack spacing={1}>
      {selection.versionId ? (
        <Typography>
          У КП вибрано незмінну версію пошиття. Редагування конфігурації не змінює її ціну.
        </Typography>
      ) : (
        <Alert severity="info">
          Створіть конфігурацію, отримайте розрахунок і виберіть збережену версію.
        </Alert>
      )}
      <Button disabled={disabled} onClick={() => setOpen(true)}>
        {selection.draftId ? 'Відкрити конфігурацію та версії' : 'Створити конфігурацію пошиття'}
      </Button>
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="lg"
        aria-labelledby="custom-picker-title"
      >
        <DialogTitle id="custom-picker-title">Приватне індивідуальне пошиття</DialogTitle>
        <DialogContent>
          <CustomWorkspace
            initialId={knownId}
            onCreated={setKnownId}
            onState={state}
            onPin={(version, draftId) => {
              onChange({ kind: 'customSewing', versionId: version.id, draftId });
              report?.(false, false);
              setOpen(false);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={close}>
            Закрити редактор пошиття
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        aria-labelledby="custom-discard-title"
      >
        <DialogTitle id="custom-discard-title">Незбережені зміни пошиття</DialogTitle>
        <DialogContent>Відхилити введення й повернутися до КП?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>Продовжити редагування</Button>
          <Button
            color="warning"
            onClick={() => {
              setConfirm(false);
              setOpen(false);
              setDirty(false);
              report?.(false, false);
            }}
          >
            Відхилити й закрити
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

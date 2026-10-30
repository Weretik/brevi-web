import { useGetCustomSewingQuery } from '@admin/clients/data-access';
import { customFabricAlternative } from '@admin/clients/model';
import { Alert, Button, CircularProgress, Stack, Tab, Tabs } from '@mui/material';
import { useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { CustomEditorForm } from './custom-editor-form';
import { CustomVersionPicker } from '../versions/custom-version-picker';

import type { CustomConfiguration, CustomDetail, CustomVersion } from '@admin/clients/model';

export function CustomWorkspace({
  initialId,
  onPin,
  onState,
  onCreated,
}: {
  initialId?: string;
  onPin?: (version: CustomVersion, draftId: string) => void;
  onState: (dirty: boolean, locked: boolean) => void;
  onCreated?: (id: string) => void;
}) {
  const [slots, setSlots] = useState<
    { key: string; id?: string; seed?: CustomConfiguration; detail?: CustomDetail }[]
  >([{ key: initialId ?? 'new', id: initialId }]);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const slot = slots[active]!;
  const query = useGetCustomSewingQuery(slot.id ?? '', { skip: !slot.id });
  const state = useCallback(
    (changed: boolean, locked: boolean) => {
      setDirty(changed);
      setBusy(locked);
      onState(changed, locked);
    },
    [onState],
  );
  const detail = slot.detail ?? (slot.id ? query.currentData : undefined);
  if (accessDenied)
    return <Alert severity="error">Конфігурацію не знайдено або доступ обмежено.</Alert>;
  return (
    <Stack spacing={3}>
      {slots.length > 1 && (
        <Tabs
          value={active}
          onChange={(_, index: number) => setActive(index)}
          variant="scrollable"
          aria-label="Альтернативи тканин"
        >
          {slots.map((value, index) => (
            <Tab disabled={busy || dirty} key={value.key} label={`Тканина ${index + 1}`} />
          ))}
        </Tabs>
      )}
      {slot.id && query.isFetching && !detail && (
        <CircularProgress aria-label="Завантаження конфігурації" />
      )}
      {slot.id && query.error && (
        <Alert
          severity="error"
          action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
        >
          Конфігурацію не знайдено або доступ обмежено.
        </Alert>
      )}
      {(!slot.id || detail) && !query.error && (
        <CustomEditorForm
          key={slot.key}
          initial={detail ?? null}
          seed={slot.seed}
          onState={state}
          onAccessLost={() => {
            setAccessDenied(true);
            state(false, false);
          }}
          onApplied={(value) => {
            setSlots((current) => [...current, { key: value.id, id: value.id, detail: value }]);
            setActive(slots.length);
          }}
          onSuggested={(configuration) => {
            setSlots((current) => [...current, { key: crypto.randomUUID(), seed: configuration }]);
            setActive(slots.length);
          }}
          reload={slot.id ? () => query.refetch().unwrap() : undefined}
          onAccepted={(value) => {
            setSlots((current) =>
              current.map((item, index) =>
                index === active ? { ...item, id: value.id, detail: value } : item,
              ),
            );
            if (!slot.id) onCreated?.(value.id);
          }}
        />
      )}
      {detail && !query.error && (
        <>
          <Button
            component={RouterLink}
            to={`/crm/custom-sewing/${detail.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Відкрити збережену конфігурацію окремо
          </Button>
          <Button
            disabled={busy || dirty || slots.length >= 8}
            onClick={() => {
              setSlots([
                ...slots,
                { key: crypto.randomUUID(), seed: customFabricAlternative(detail.configuration) },
              ]);
              setActive(slots.length);
            }}
          >
            Створити альтернативу з іншою тканиною
          </Button>
          <CustomVersionPicker
            key={detail.id}
            id={detail.id}
            detail={detail}
            onAccessLost={() => {
              setAccessDenied(true);
              state(false, false);
            }}
            disabled={busy || dirty}
            onPin={onPin ? (version) => onPin(version, detail.id) : undefined}
          />
        </>
      )}
    </Stack>
  );
}

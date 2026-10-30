import {
  useCreateCustomTemplateMutation,
  useGetCustomTemplatesQuery,
} from '@admin/clients/data-access';
import { templateSelections } from '@admin/clients/model';
import { isAdminApiError } from '@admin/shared/api-client';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { CustomTemplateSelection } from './custom-template-selection';
import { useTemplateAction } from '../../hooks/custom-templates/use-template-action';

import type { CustomDetail } from '@admin/clients/model';

export function CustomTemplatesPanel({
  detail,
  disabled,
  onApplied,
  onBusy,
  onAccessLost,
}: {
  detail: CustomDetail | null;
  disabled: boolean;
  onApplied: (draft: CustomDetail) => void;
  onBusy?: (busy: boolean) => void;
  onAccessLost?: () => void;
}) {
  const [page, setPage] = useState(1);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [selected, setSelected] = useState('');
  const [introduction, setIntroduction] = useState('');
  const list = useGetCustomTemplatesQuery({ page, includeArchived });
  const [create] = useCreateCustomTemplateMutation();
  const action = useTemplateAction(onAccessLost);
  const [childBusy, setChildBusy] = useState(false);
  const locked = disabled || action.pending || action.uncertain || childBusy;
  useEffect(() => {
    onBusy?.(action.pending || action.uncertain || childBusy);
  }, [action.pending, action.uncertain, childBusy, onBusy]);
  useEffect(() => () => onBusy?.(false), [onBusy]);
  const denied = [list.error].some(
    (error) => isAdminApiError(error) && [401, 403, 404].includes(error.status),
  );
  useEffect(() => {
    if (denied) {
      setSelected('');
      onAccessLost?.();
    }
  }, [denied, onAccessLost]);
  if (action.forbidden || denied) return <Alert severity="error">Шаблони недоступні.</Alert>;
  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h3">
        Шаблони конфігурацій
      </Typography>
      {disabled && !action.uncertain && !childBusy && (
        <Alert severity="info">
          Спочатку збережіть зміни конфігурації та завершіть поточні дії.
        </Alert>
      )}
      {action.error && <Alert severity="error">{action.error}</Alert>}
      {action.uncertain && (
        <Alert
          severity="warning"
          action={
            <Button disabled={action.pending} onClick={() => void action.execute()}>
              Повторити створення шаблону
            </Button>
          }
        >
          Результат створення невідомий; повтор використовує той самий запит.
        </Alert>
      )}
      <TextField
        label="Вступ нового шаблону для клієнта"
        multiline
        slotProps={{ htmlInput: { maxLength: 4000 } }}
        value={introduction}
        disabled={locked}
        onChange={(event) => setIntroduction(event.target.value)}
      />
      <Button
        disabled={locked || !detail}
        onClick={() => {
          if (!detail) return;
          const payload = {
            requestId: crypto.randomUUID(),
            introduction,
            selections: templateSelections(detail.configuration),
          };
          void action.execute(async () => {
            const created = await create(payload).unwrap();
            if (!action.isCurrent()) return;
            setSelected(created.id);
          });
        }}
      >
        Створити шаблон зі збереженої конфігурації
      </Button>
      <FormControlLabel
        control={
          <Checkbox
            checked={includeArchived}
            disabled={locked}
            onChange={(_event, checked) => {
              setIncludeArchived(checked);
              setPage(1);
              setSelected('');
            }}
          />
        }
        label="Показати архівні шаблони"
      />
      {list.error ? (
        <Alert
          severity="error"
          action={
            <Button disabled={locked} onClick={() => void list.refetch()}>
              Повторити список
            </Button>
          }
        >
          Не вдалося завантажити шаблони.
        </Alert>
      ) : list.isFetching ? (
        <Typography role="status">Завантаження шаблонів…</Typography>
      ) : (
        list.currentData && (
          <>
            {list.currentData.rows.length ? (
              <TextField
                select
                label="Оберіть шаблон"
                value={selected}
                disabled={locked}
                onChange={(event) => setSelected(event.target.value)}
              >
                <MenuItem value="">Не обрано</MenuItem>
                {list.currentData.rows.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} · №{item.versionNumber}
                    {item.archived ? ' · архів' : ''}
                  </MenuItem>
                ))}
                {selected && !list.currentData.rows.some((item) => item.id === selected) && (
                  <MenuItem value={selected}>Щойно створений шаблон</MenuItem>
                )}
              </TextField>
            ) : (
              <Typography>Шаблонів немає.</Typography>
            )}
            {list.currentData.totalPages > 1 && (
              <Pagination
                page={page}
                count={list.currentData.totalPages}
                disabled={locked}
                onChange={(_event, value) => {
                  setPage(value);
                  setSelected('');
                }}
              />
            )}
          </>
        )
      )}
      {selected && (
        <CustomTemplateSelection
          key={selected}
          id={selected}
          detail={detail}
          disabled={disabled || action.pending || action.uncertain}
          onApplied={onApplied}
          onBusy={setChildBusy}
          onAccessLost={onAccessLost}
        />
      )}
    </Stack>
  );
}

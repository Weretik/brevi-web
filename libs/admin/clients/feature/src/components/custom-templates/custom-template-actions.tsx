import {
  useApplyCustomTemplateMutation,
  useArchiveCustomTemplateMutation,
  useReviseCustomTemplateMutation,
} from '@admin/clients/data-access';
import { templateSelections } from '@admin/clients/model';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { TemplateReviewDialog } from './template-review-dialog';
import { useTemplateAction } from '../../hooks/custom-templates/use-template-action';

import type { CustomDetail, CustomTemplateDetail } from '@admin/clients/model';

export function CustomTemplateActions({
  value,
  detail,
  disabled,
  onApplied,
  onBusy,
  onAccessLost,
  onRefresh,
}: {
  value: CustomTemplateDetail;
  detail: CustomDetail | null;
  disabled: boolean;
  onApplied: (draft: CustomDetail) => void;
  onBusy?: (busy: boolean) => void;
  onAccessLost?: () => void;
  onRefresh?: () => void;
}) {
  const [introduction, setIntroduction] = useState(value.introduction);
  const [review, setReview] = useState(false);
  const [message, setMessage] = useState('');
  const [apply] = useApplyCustomTemplateMutation();
  const [revise] = useReviseCustomTemplateMutation();
  const [archive] = useArchiveCustomTemplateMutation();
  const action = useTemplateAction(onAccessLost);
  useEffect(() => {
    onBusy?.(action.pending || action.uncertain);
  }, [action.pending, action.uncertain, onBusy]);
  useEffect(() => () => onBusy?.(false), [onBusy]);
  const locked = disabled || action.pending || action.uncertain;
  if (action.forbidden)
    return <Alert severity="error">Шаблон не знайдено або доступ обмежено.</Alert>;
  const target = () => ({ id: value.id, revision: value.revision, requestId: crypto.randomUUID() });
  return (
    <Stack spacing={2}>
      <Typography>
        {value.selections.name} · версія №{value.versionNumber}
        {value.archived ? ' · в архіві' : ''}
      </Typography>
      {action.error && <Alert severity="error">{action.error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      {action.uncertain && (
        <Alert
          severity="warning"
          action={
            <Button disabled={action.pending} onClick={() => void action.execute()}>
              Повторити ту саму дію
            </Button>
          }
        >
          Результат запису невідомий. Інші дії заблоковані.
        </Alert>
      )}
      <TextField
        label="Вступ шаблону для клієнта"
        value={introduction}
        multiline
        minRows={2}
        slotProps={{ htmlInput: { maxLength: 4000 } }}
        disabled={locked || !value.canEdit}
        onChange={(event) => setIntroduction(event.target.value)}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        {onRefresh && (
          <Button disabled={locked} onClick={onRefresh}>
            Оновити шаблон із сервера
          </Button>
        )}
        <Button disabled={locked || value.archived} onClick={() => setReview(true)}>
          Переглянути й застосувати шаблон
        </Button>
        {value.canEdit && (
          <>
            <Button
              disabled={locked || value.archived || !detail}
              onClick={() => {
                if (!detail) return;
                const payload = {
                  ...target(),
                  introduction,
                  selections: templateSelections(detail.configuration),
                };
                void action.execute(async () => {
                  await revise(payload).unwrap();
                  if (!action.isCurrent()) return;
                  setMessage('Нову версію шаблону збережено зі складом поточної конфігурації.');
                });
              }}
            >
              Зберегти поточний склад як нову версію шаблону
            </Button>
            <Button
              disabled={locked}
              onClick={() => {
                const payload = { ...target(), archived: !value.archived };
                void action.execute(async () => {
                  await archive(payload).unwrap();
                  if (!action.isCurrent()) return;
                  setMessage(payload.archived ? 'Шаблон архівовано.' : 'Шаблон відновлено.');
                });
              }}
            >
              {value.archived ? 'Відновити шаблон' : 'Архівувати шаблон'}
            </Button>
          </>
        )}
      </Stack>
      {!value.canEdit && (
        <Alert severity="info">
          Можна застосувати цей шаблон. Редагування доступне власнику та адміністратору.
        </Alert>
      )}
      <TemplateReviewDialog
        value={value}
        open={review}
        disabled={locked}
        onCancel={() => setReview(false)}
        onApply={() => {
          const payload = {
            ...target(),
            versionId: value.versionId,
            customerId: detail?.customerId ?? null,
            quoteId: detail?.quoteId ?? null,
          };
          setReview(false);
          void action.execute(async () => {
            const result = await apply(payload).unwrap();
            if (!action.isCurrent()) return;
            setReview(false);
            onApplied(result.draft);
          });
        }}
      />
    </Stack>
  );
}

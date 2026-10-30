import {
  useCreateCustomSewingMutation,
  useSaveCustomSewingMutation,
  useCalculateCustomSewingMutation,
  useSaveCustomSewingVersionMutation,
} from '@admin/clients/data-access';
import { customConfigurationErrors, emptyCustomConfiguration } from '@admin/clients/model';
import { isAdminApiError } from '@admin/shared/api-client';
import { useRef, useState } from 'react';

import { useStableRequest } from '../requests/use-stable-request';

import type { CustomConfiguration, CustomDetail } from '@admin/clients/model';

export function useCustomEditor(
  initial: CustomDetail | null,
  seed?: CustomConfiguration,
  onAccepted?: (value: CustomDetail) => void,
  externalLocked = false,
) {
  const [detail, setDetail] = useState(initial);
  const [configuration, setConfiguration] = useState(
    initial?.configuration ?? seed ?? emptyCustomConfiguration(),
  );
  const [baseline, setBaseline] = useState(
    JSON.stringify(initial?.configuration ?? seed ?? emptyCustomConfiguration()),
  );
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [create] = useCreateCustomSewingMutation();
  const [save] = useSaveCustomSewingMutation();
  const [calculate] = useCalculateCustomSewingMutation();
  const [version] = useSaveCustomSewingVersionMutation();
  const request = useStableRequest();
  const busy = useRef(false);
  const captured = useRef<null | {
    action: 'save' | 'calculate' | 'version';
    run: () => Promise<CustomDetail>;
  }>(null);
  const dirty = JSON.stringify(configuration) !== baseline;
  const accept = (value: CustomDetail) => {
    setDetail(value);
    setConfiguration(value.configuration);
    setBaseline(JSON.stringify(value.configuration));
    onAccepted?.(value);
  };
  const forbid = () => {
    const empty = emptyCustomConfiguration();
    setForbidden(true);
    setConfiguration(empty);
    setBaseline(JSON.stringify(empty));
    setDetail(null);
    setErrors({});
    setUncertain(false);
    captured.current = null;
    request.reset();
  };
  const act = async (action: 'save' | 'calculate' | 'version') => {
    if (
      busy.current ||
      externalLocked ||
      forbidden ||
      detail?.canEdit === false ||
      (captured.current && captured.current.action !== action)
    )
      return;
    if (!captured.current) {
      const validation = customConfigurationErrors(configuration, action !== 'save');
      setErrors(validation);
      if (Object.keys(validation).length) return;
      if (action !== 'save' && (!detail || dirty)) {
        setError('Спочатку збережіть зміни конфігурації.');
        return;
      }
      const preview = detail?.preview;
      if (
        action === 'version' &&
        (!preview?.isCalculated || preview.blockers.length || preview.expiresAt <= Date.now())
      ) {
        setError('Отримайте чинний серверний розрахунок без блокерів.');
        return;
      }
      const requestId = request.id({
        action,
        id: detail?.id,
        revision: detail?.revision,
        configuration,
        token: preview?.token,
      });
      const run =
        action === 'save'
          ? () =>
              detail
                ? save({
                    id: detail.id,
                    revision: detail.revision,
                    configuration,
                    requestId,
                  }).unwrap()
                : create({ configuration, requestId }).unwrap()
          : action === 'calculate'
            ? () => calculate({ id: detail!.id, revision: detail!.revision, requestId }).unwrap()
            : () =>
                version({
                  id: detail!.id,
                  revision: detail!.revision,
                  requestId,
                  basisToken: preview!.token,
                }).unwrap();
      captured.current = { action, run };
    }
    busy.current = true;
    setPending(true);
    setError('');
    try {
      const value = await captured.current.run();
      accept(value);
      captured.current = null;
      request.reset();
      setUncertain(false);
    } catch (failure) {
      const unknown =
        !isAdminApiError(failure) ||
        failure.status === 0 ||
        failure.status === 408 ||
        failure.status >= 500;
      setUncertain(unknown);
      if (!unknown) captured.current = null;
      if (isAdminApiError(failure)) {
        if (failure.status === 403 || failure.status === 404) {
          forbid();
        }
        const fields: Record<string, string> = {};
        for (const path of Object.keys(failure.fieldErrors)) {
          const field = path.replace(/^configuration\./i, '').split(/[.\[\]]/)[0] ?? '';
          const key = field.charAt(0).toLowerCase() + field.slice(1);
          fields[key] = 'Перевірте значення: сервер відхилив це поле.';
        }
        if (Object.keys(fields).length) setErrors(fields);
      }
      setError(
        isAdminApiError(failure)
          ? failure.message
          : 'Дію не завершено. Повторіть ту саму дію; введення збережене.',
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  const refresh = async (loader: () => Promise<CustomDetail>) => {
    if (busy.current || captured.current || forbidden || externalLocked) return false;
    busy.current = true;
    setPending(true);
    setError('');
    try {
      accept(await loader());
      request.reset();
      setErrors({});
      return true;
    } catch (failure) {
      if (isAdminApiError(failure) && (failure.status === 403 || failure.status === 404)) {
        forbid();
        setError('Конфігурацію не знайдено або доступ обмежено.');
      } else setError('Не вдалося оновити конфігурацію. Введення збережене.');
      return false;
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  return {
    detail,
    configuration,
    setConfiguration: (value: CustomConfiguration) => {
      if (
        !busy.current &&
        !captured.current &&
        !forbidden &&
        !externalLocked &&
        detail?.canEdit !== false
      )
        setConfiguration(value);
    },
    dirty,
    error,
    errors,
    pending,
    uncertain,
    forbidden,
    retryAction: captured.current?.action,
    act,
    refresh,
    accept,
    forbid,
    locked: pending || uncertain || forbidden || externalLocked || detail?.canEdit === false,
  };
}

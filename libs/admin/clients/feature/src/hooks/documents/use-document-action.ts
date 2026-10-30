import { adminApi } from '@admin/shared/api-client';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { useTemplateAction } from '../custom-templates/use-template-action';
/** Reuses captured same-key actions and connects their lock to the quote editor. */
export function useDocumentAction(
  onLock: (pending: boolean, uncertain: boolean) => void,
  onAccessLost: () => void,
) {
  const dispatch = useDispatch();
  const lock = useRef(onLock);
  lock.current = onLock;
  const action = useTemplateAction(() => {
    dispatch(adminApi.util.resetApiState());
    onAccessLost();
  });
  useEffect(() => {
    lock.current(action.pending, action.uncertain);
  }, [action.pending, action.uncertain]);
  useEffect(() => () => lock.current(false, false), []);
  return action;
}

import {
  useCreatePpeOfferVersionMutation,
  useCreatePpeRuleVersionMutation,
} from '@admin/products/data-access';

import { usePpeVersionRequest } from './use-ppe-version-request';

import type { PpeOfferValues, PpeRuleValues } from '@admin/products/model';

export function usePpeVersionActions(productId: number, canManage: boolean) {
  const [saveOffer, offer] = useCreatePpeOfferVersionMutation();
  const [saveRule, rule] = useCreatePpeRuleVersionMutation();
  const request = usePpeVersionRequest(productId, canManage, offer.isLoading || rule.isLoading);
  return {
    busy: request.busy,
    conflict: request.conflict,
    error: request.error,
    saveOffer: (expected: string | null, values: PpeOfferValues) => {
      void request.submit('offer', expected, values, (requestId) =>
        saveOffer({ productId, expectedVersionId: expected, requestId, values }).unwrap(),
      );
    },
    saveRule: (expected: string | null, values: PpeRuleValues) => {
      void request.submit('rule', expected, values, (requestId) =>
        saveRule({ expectedVersionId: expected, requestId, values }).unwrap(),
      );
    },
  };
}

import { Alert, Button, CircularProgress, Stack } from '@mui/material';

import { PpeOfferVersionEditor } from './ppe-offer-version-editor';
import { PpeRuleVersionEditor } from './ppe-rule-version-editor';
import { usePpeVersionActions } from '../../hooks/ppe-pricing/use-ppe-version-actions';

import type { PpeProductPricing } from '@admin/products/model';

export function PpePricingInputsEditor({
  pricing,
  onReload,
  blocked,
  initialSupplierCost,
}: {
  pricing: PpeProductPricing;
  onReload: () => void;
  blocked: boolean;
  initialSupplierCost?: number;
}) {
  const actions = usePpeVersionActions(pricing.productId, true);
  const disabled = actions.busy || actions.conflict || blocked;
  const code = pricing.rule?.values.code ?? pricing.offer?.values.ruleCode;
  return (
    <Stack sx={{ gap: 2 }}>
      {actions.error && (
        <Alert
          severity="error"
          action={
            actions.conflict ? <Button onClick={onReload}>Оновити вхідні дані</Button> : undefined
          }
        >
          {actions.error}
        </Alert>
      )}
      {actions.busy && <CircularProgress size={22} aria-label="Збереження цін ЗІЗ" />}
      <PpeOfferVersionEditor
        key={pricing.offer?.id ?? 'new'}
        version={pricing.offer}
        initialSupplierCost={initialSupplierCost}
        disabled={disabled}
        onSave={actions.saveOffer}
      />
      {code && (
        <PpeRuleVersionEditor
          key={pricing.rule?.id ?? code}
          version={pricing.rule}
          code={code}
          disabled={disabled}
          onSave={actions.saveRule}
        />
      )}
    </Stack>
  );
}

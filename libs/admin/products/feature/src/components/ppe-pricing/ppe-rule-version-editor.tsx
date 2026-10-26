import { parsePpeMarkupDraft } from '@admin/products/model';
import { PpeRuleForm } from '@admin/products/ui';
import { useState } from 'react';

import type { PpeRuleMarkupDraft, PpeRuleValues, PpeRuleVersion } from '@admin/products/model';

export function PpeRuleVersionEditor({
  version,
  code,
  disabled,
  onSave,
}: {
  version: PpeRuleVersion | null;
  code: string;
  disabled: boolean;
  onSave: (expected: string | null, values: PpeRuleValues) => void;
}) {
  const [value, setValue] = useState<PpeRuleMarkupDraft>(
    version
      ? {
          retail: String(version.values.markups.retail),
          wholesale: String(version.values.markups.wholesale),
          largeWholesale: String(version.values.markups.largeWholesale),
        }
      : { retail: '', wholesale: '', largeWholesale: '' },
  );
  const [provenance, setProvenance] = useState({
    source: version?.values.source ?? 'Admin entry',
    sourceDate: version?.values.sourceDate ?? new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);
  const change = (next: PpeRuleMarkupDraft) => {
    setValue(next);
    setError(null);
    setProvenance({ source: 'Admin revision', sourceDate: new Date().toISOString() });
  };
  const save = () => {
    const markups = parsePpeMarkupDraft(value);
    if (!markups) {
      setError('Заповніть три невід’ємні націнки з точністю до 8 знаків.');
      return;
    }
    onSave(version?.id ?? null, { code, markups, ...provenance });
  };
  return (
    <PpeRuleForm
      code={code}
      value={value}
      onChange={change}
      disabled={disabled}
      onSave={save}
      error={error}
    />
  );
}

import {
  downloadProductionPackage,
  useExportQuoteProductionMutation,
} from '@admin/clients/data-access';
import { useState } from 'react';

import { savePrivateDocument } from '../save-private-document';
import { useDocumentAction } from '../use-document-action';

import type { ProductionPackageView, QuoteDetail } from '@admin/clients/model';

export function useQuoteProduction(
  detail: QuoteDetail,
  disabled: boolean,
  onLock: (pending: boolean, uncertain: boolean) => void,
) {
  const [selection, setSelection] = useState<string[]>([]);
  const [artifact, setArtifact] = useState<ProductionPackageView | null>(null);
  const action = useDocumentAction(onLock, () => {
    setArtifact(null);
    setSelection([]);
  });
  const [exportPackage] = useExportQuoteProductionMutation();
  const choices = detail.draft.items
    .filter((item) => item.included)
    .flatMap((item) => item.variants)
    .filter(
      (variant) =>
        variant.visible && variant.selection.kind === 'customSewing' && !!variant.publicId,
    )
    .map((variant) => ({ id: variant.publicId!, label: variant.title }));
  const locked = disabled || action.pending || action.uncertain || action.forbidden;
  const canExport =
    !locked &&
    detail.canEdit &&
    !detail.archived &&
    detail.state !== 'draft' &&
    selection.length > 0 &&
    selection.length <= 100;
  const select = (id: string, checked: boolean) => {
    if (locked) return;
    setSelection((value) =>
      checked ? [...new Set([...value, id])] : value.filter((key) => key !== id),
    );
    setArtifact(null);
  };
  const exportZip = () => {
    if (!canExport) return;
    const intent = {
      quoteId: detail.publicId,
      versionId: detail.versionId,
      requestId: crypto.randomUUID(),
      selectedVariantIds: [...selection],
    };
    void action.execute(async () => {
      const value = await exportPackage(intent).unwrap();
      if (action.isCurrent()) setArtifact(value);
    });
  };
  const download = () => {
    if (!artifact || locked) return;
    const pinned = artifact;
    void action.execute(async () => {
      const blob = await downloadProductionPackage(pinned);
      if (action.isCurrent()) savePrivateDocument(blob, `production-${pinned.id}.zip`);
    });
  };
  return { action, choices, selection, artifact, locked, canExport, select, exportZip, download };
}

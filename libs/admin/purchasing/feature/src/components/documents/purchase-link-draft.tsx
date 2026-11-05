import { useGetPurchaseDocumentTemplateQuery } from '@admin/purchasing/data-access';
import { checkPurchaseDocument, purchaseDocumentFormOf } from '@admin/purchasing/model';
import { PurchaseDraftView } from '@admin/purchasing/ui';
import { Typography } from '@mui/material';
import { useMemo } from 'react';

/** What the AI read from an original that failed the checks (its last answer, kept on the server). */
export function PurchaseLinkDraft({ fileId }: { fileId: string }) {
  const template = useGetPurchaseDocumentTemplateQuery(fileId);
  const draft = useMemo(() => {
    if (template.data === undefined) return null;
    const { values } = purchaseDocumentFormOf(template.data);
    return values.items.some((item) => item.name)
      ? { values, check: checkPurchaseDocument(values) }
      : null;
  }, [template.data]);
  if (template.isFetching && !draft)
    return (
      <Typography variant="caption" color="text.secondary">
        Завантажуємо, що прочитав ШІ…
      </Typography>
    );
  return draft ? <PurchaseDraftView values={draft.values} check={draft.check} /> : null;
}

import { ReferenceEditorDrawer } from '@admin/references/ui';
import { ItemIssueForm, ItemIssuePreviewPanel } from '@admin/warehouse/ui';
import { Alert, Button, Stack } from '@mui/material';

import { useItemIssue } from '../../hooks/item-issue/use-item-issue';

import type { FabricStockFabric, ItemFabric } from '@admin/warehouse/model';

interface Props {
  card: ItemFabric;
  fabrics: readonly FabricStockFabric[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** «Видача» to an item by actual cutting: form, check, «Записати». */
export function ItemIssueDrawer({ card, fabrics, onClose, onSaved }: Props) {
  const issue = useItemIssue(card, fabrics, onSaved);
  return (
    <ReferenceEditorDrawer
      titleId="item-issue-title"
      title={`Видача тканини: № ${card.orderNumber} · ${card.modelName}`}
      description={
        issue.checking
          ? 'Перевірте видачу. Після «Записати» склад зміниться.'
          : 'Скільки виробів розкроєно зараз і скільки метрів якої тканини фактично взято.'
      }
      formId="item-issue-form"
      paperWidth={760}
      readOnly={false}
      editLabel={null}
      saving={issue.saving}
      submitLabel={issue.checking ? 'Записати' : 'Перевірити'}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={issue.submit}
    >
      <Stack sx={{ gap: 2 }}>
        {issue.message && <Alert severity="error">{issue.message}</Alert>}
        {issue.preview ? (
          <>
            <ItemIssuePreviewPanel preview={issue.preview} issuedOn={issue.values.issuedOn} />
            <Button sx={{ alignSelf: 'flex-start' }} disabled={issue.saving} onClick={issue.back}>
              Назад до форми
            </Button>
          </>
        ) : (
          <ItemIssueForm
            values={issue.values}
            errors={issue.errors}
            card={card}
            fabrics={fabrics}
            disabled={issue.saving}
            onChange={issue.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

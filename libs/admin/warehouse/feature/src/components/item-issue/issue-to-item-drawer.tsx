import { ReferenceEditorDrawer } from '@admin/references/ui';
import { useGetFabricIssueItemsQuery } from '@admin/warehouse/data-access';
import { FABRIC_ISSUE_ITEM_SEARCH_MAX_LENGTH } from '@admin/warehouse/model';
import { FabricIssueItemList } from '@admin/warehouse/ui';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Alert, Button, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import { useDeferredValue, useState } from 'react';

import { ItemFabricSection } from './item-fabric-section';

import type { FabricIssueItem } from '@admin/warehouse/model';

interface Props {
  onClose: () => void;
  onMessage: (message: string) => void;
}

/** «Видача на завдання»: find an open item, then issue to it by actual cutting. */
export function IssueToItemDrawer({ onClose, onMessage }: Props) {
  const [search, setSearch] = useState('');
  const [chosen, setChosen] = useState<FabricIssueItem | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const query = useDeferredValue(search);
  const items = useGetFabricIssueItemsQuery(query, { skip: chosen !== null });
  return (
    <ReferenceEditorDrawer
      titleId="issue-to-item-title"
      title="Видача на завдання"
      description="Знайдіть позицію відкритого завдання за номером, клієнтом, моделлю або тканиною."
      formId="issue-to-item"
      paperWidth={760}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      {chosen ? (
        <Stack sx={{ gap: 2 }}>
          <Button
            startIcon={<ArrowBackOutlinedIcon />}
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => {
              setChosen(null);
              setNotice(null);
            }}
          >
            До пошуку
          </Button>
          <Typography variant="subtitle1">
            № {chosen.orderNumber} · {chosen.clientName} · {chosen.modelName}
          </Typography>
          {notice && <Alert severity="info">{notice}</Alert>}
          <ItemFabricSection
            orderId={chosen.orderId}
            itemId={chosen.itemId}
            scope="stock"
            onMessage={(message) => {
              setNotice(message);
              onMessage(message);
            }}
          />
        </Stack>
      ) : (
        <Stack sx={{ gap: 2 }}>
          <TextField
            label="Пошук"
            autoFocus
            value={search}
            placeholder="Номер завдання, клієнт, модель або тканина"
            slotProps={{ htmlInput: { maxLength: FABRIC_ISSUE_ITEM_SEARCH_MAX_LENGTH } }}
            onChange={(event) => setSearch(event.target.value)}
          />
          {items.isFetching && <LinearProgress />}
          {items.error && <Alert severity="error">Не вдалося знайти позиції.</Alert>}
          {items.data && (
            <FabricIssueItemList
              items={items.data.items}
              hasMore={items.data.hasMore}
              onChoose={setChosen}
            />
          )}
        </Stack>
      )}
    </ReferenceEditorDrawer>
  );
}

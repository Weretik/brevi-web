import { ReferenceBulkDeleteButton, ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Box, Button } from '@mui/material';

interface Props {
  /** When KeepinCRM last refreshed the cards. */
  lastSync: string | null;
  selectedCount: number;
  deleteDisabled: boolean;
  syncing: boolean;
  onDelete: () => void;
  onSync: () => void;
  onCreate: () => void;
}

/** «Постачальники» title with the last KeepinCRM refresh, bulk delete, «Оновити з KeepinCRM» and «Додати». */
export function SuppliersHeader({
  lastSync,
  selectedCount,
  deleteDisabled,
  syncing,
  onDelete,
  onSync,
  onCreate,
}: Props) {
  const { canCreate, canEdit } = usePageRights();
  return (
    <ReferencePageHeader
      title="Постачальники"
      subtitle={
        lastSync ? (
          <>
            Картки оновлюються з KeepinCRM щодня. Останнє оновлення:{' '}
            <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
              {new Date(lastSync).toLocaleString('uk-UA', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </Box>
          </>
        ) : (
          'Контакти та інформація про постачальників'
        )
      }
      actions={
        <>
          <ReferenceBulkDeleteButton
            selectedCount={selectedCount}
            disabled={deleteDisabled}
            onDelete={onDelete}
          />
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<SyncOutlinedIcon />}
              disabled={syncing}
              onClick={onSync}
            >
              {syncing ? 'Оновлення…' : 'Оновити з KeepinCRM'}
            </Button>
          )}
          {canCreate && (
            <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={onCreate}>
              Додати постачальника
            </Button>
          )}
        </>
      }
    />
  );
}

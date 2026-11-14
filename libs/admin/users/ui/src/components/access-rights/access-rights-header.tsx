import AddIcon from '@mui/icons-material/Add';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';

interface AccessRightsHeaderProps {
  /** The rights are loaded; before that the page shows no actions. */
  loaded: boolean;
  /** The open role can be changed (not the director). */
  canSave: boolean;
  dirty: boolean;
  saving: boolean;
  onNewRole: () => void;
  onSave: () => void;
}

/** «Права доступу»: title, «Нова роль» and «Зберегти». */
export function AccessRightsHeader({
  loaded,
  canSave,
  dirty,
  saving,
  onNewRole,
  onSave,
}: AccessRightsHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ alignItems: { sm: 'flex-end' }, gap: 2, justifyContent: 'space-between' }}
    >
      <div>
        <Typography component="h1" variant="h4">
          Права доступу
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5 }} variant="body2">
          Виберіть роль і позначте, що вона бачить і що може. Директор завжди має всі права.
        </Typography>
      </div>
      {loaded ? (
        <Stack direction="row" sx={{ flexShrink: 0, gap: 1 }}>
          <Button onClick={onNewRole} startIcon={<AddIcon />} variant="outlined">
            Нова роль
          </Button>
          {canSave ? (
            <Button disabled={!dirty || saving} onClick={onSave} variant="contained">
              {saving && <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />}
              Зберегти
            </Button>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}

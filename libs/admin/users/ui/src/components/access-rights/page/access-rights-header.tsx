import AddIcon from '@mui/icons-material/Add';
import { Button, Stack, Typography } from '@mui/material';

interface AccessRightsHeaderProps {
  /** The rights are loaded; before that the page shows no actions. */
  loaded: boolean;
  onNewRole: () => void;
}

/** «Права доступу»: title, the line under it and «Нова роль»; saving lives in the bar at the bottom. */
export function AccessRightsHeader({ loaded, onNewRole }: AccessRightsHeaderProps) {
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
          Виберіть роль ліворуч і позначте, що вона бачить і може. Директор завжди має всі права.
        </Typography>
      </div>
      {loaded ? (
        <Button
          onClick={onNewRole}
          startIcon={<AddIcon />}
          sx={{ flexShrink: 0 }}
          variant="outlined"
        >
          Нова роль
        </Button>
      ) : null}
    </Stack>
  );
}

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';

/** The number in front of a condition. */
export const ruleNumber = {
  fontFamily: 'var(--admin-font-mono)',
  color: 'text.secondary',
} as const;

interface Props {
  rule: string;
  index: number;
  /** «Видалити умову …?» is asked in the row. */
  asking: boolean;
  busy: boolean;
  disabled: boolean;
  onEdit: () => void;
  onAsk: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

/** One condition: its text with «Змінити» and «Видалити», or the delete question. */
export function AiRuleView({
  rule,
  index,
  asking,
  busy,
  disabled,
  onEdit,
  onAsk,
  onCancel,
  onDelete,
}: Props) {
  return asking ? (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1, flex: 1, alignItems: { sm: 'center' } }}
    >
      <Typography variant="body2" color="error.main" sx={{ flex: 1, minWidth: 0 }}>
        Видалити умову «{rule}»?
      </Typography>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button
          size="small"
          color="error"
          variant="outlined"
          disabled={disabled}
          onClick={onDelete}
        >
          Видалити
        </Button>
        <Button size="small" disabled={disabled} onClick={onCancel}>
          Ні
        </Button>
      </Stack>
    </Stack>
  ) : (
    <>
      <Typography variant="body2" sx={{ flex: 1, minWidth: 0, pt: 0.5, wordBreak: 'break-word' }}>
        {rule}
      </Typography>
      <Tooltip title="Змінити">
        <span>
          <IconButton
            size="small"
            aria-label={`Змінити умову ${index + 1}`}
            disabled={busy}
            onClick={onEdit}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Видалити">
        <span>
          <IconButton
            size="small"
            aria-label={`Видалити умову ${index + 1}`}
            disabled={busy}
            onClick={onAsk}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}

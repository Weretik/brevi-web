import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Button, Stack, Typography } from '@mui/material';

import { SewingCardStatusPill } from './sewing-card-status-pill';

import type { SewingCardTone } from './sewing-card-status-pill';

interface Props {
  name: string;
  code: string | null;
  sectionName: string | null;
  season: string | null;
  active: boolean | null;
  verifiedOn: string | null;
  verified: boolean;
  siteUrl: string | null;
  status: { label: string; tone: SewingCardTone };
  canEdit: boolean;
  deleteDisabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/** Page header of a sewing model card: what the sheet tab «Товари» holds for the model. */
export function SewingCardHeader(props: Props) {
  const line = [props.code, props.sectionName, props.season].filter(Boolean).join(' · ');
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 2, justifyContent: 'space-between', alignItems: { md: 'flex-start' } }}
    >
      <Stack sx={{ gap: 1, minWidth: 0 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Швейна продукція
        </Typography>
        <Typography variant="h4" component="h1" sx={{ overflowWrap: 'anywhere' }}>
          {props.name}
        </Typography>
        {line && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {line}
          </Typography>
        )}
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          <SewingCardStatusPill label={props.status.label} tone={props.status.tone} />
          {props.active !== null && (
            <SewingCardStatusPill
              label={props.active ? 'Активна' : 'Вимкнена'}
              tone={props.active ? 'success' : 'neutral'}
            />
          )}
          <SewingCardStatusPill
            label={
              props.verified
                ? `Перевірено${props.verifiedOn ? ` ${props.verifiedOn}` : ''}`
                : 'Не перевірено'
            }
            tone={props.verified ? 'success' : 'neutral'}
          />
        </Stack>
      </Stack>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', flexShrink: 0 }}>
        {props.siteUrl && (
          <Button
            variant="outlined"
            href={props.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewOutlinedIcon fontSize="small" />}
          >
            На сайті
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          disabled={props.deleteDisabled}
          onClick={props.onDelete}
        >
          Видалити
        </Button>
        {props.canEdit && (
          <Button variant="contained" onClick={props.onEdit}>
            Редагувати
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

import { usePageRights } from '@admin/shared/ui';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Button, FormControlLabel, Stack, Switch, Typography } from '@mui/material';

import { SewingCardStatusPill } from './sewing-card-status-pill';

import type { SewingCardTone } from './sewing-card-status-pill';

interface Props {
  /** Overline above the name; «Швейна продукція» by default. */
  kindLabel?: string;
  name: string;
  code: string | null;
  sectionName: string | null;
  season: string | null;
  active: boolean | null;
  siteUrl: string | null;
  /** Only a problem; null when everything is priced. */
  status: { label: string; tone: SewingCardTone } | null;
  canEdit: boolean;
  /** «Продовжити заповнення» in the «Нова модель» wizard while the model is not launched. */
  continueHref?: string | null;
  deleteDisabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  /** Switch «Активний» (CAT-018) for staff who manage products; otherwise only «Вимкнена» is shown. */
  activeSwitch?: { saving: boolean; onChange: (active: boolean) => void };
}

/** Page header of a product card: what the sheet tab «Товари» or «ЗІЗ» holds for the product. */
export function SewingCardHeader(props: Props) {
  const { canDelete } = usePageRights();
  const line = [props.code, props.sectionName, props.season].filter(Boolean).join(' · ');
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 2, justifyContent: 'space-between', alignItems: { md: 'flex-start' } }}
    >
      <Stack sx={{ gap: 1, minWidth: 0 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {props.kindLabel ?? 'Швейна продукція'}
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
          {props.status && (
            <SewingCardStatusPill label={props.status.label} tone={props.status.tone} />
          )}
          {props.active === false && !props.activeSwitch && (
            <SewingCardStatusPill label="Вимкнена" tone="neutral" />
          )}
        </Stack>
      </Stack>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', flexShrink: 0, alignItems: 'center' }}>
        {props.activeSwitch && props.active !== null && (
          <FormControlLabel
            label="Активний"
            control={
              <Switch
                checked={props.active}
                disabled={props.activeSwitch.saving}
                onChange={(_event, checked) => props.activeSwitch?.onChange(checked)}
              />
            }
          />
        )}
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
        {props.continueHref && (
          <Button variant="outlined" href={props.continueHref}>
            Продовжити заповнення
          </Button>
        )}
        {canDelete && (
          <Button
            variant="outlined"
            color="error"
            disabled={props.deleteDisabled}
            onClick={props.onDelete}
          >
            Видалити
          </Button>
        )}
        {props.canEdit && (
          <Button variant="contained" onClick={props.onEdit}>
            Редагувати
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

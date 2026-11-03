import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';

import { SewingCreateStepper } from './sewing-create-stepper';
import { SewingCardStatusPill } from '../sewing-card/sewing-card-status-pill';

import type { SewingCreateStep } from '@admin/products/model';
import type { ComponentProps, ReactNode } from 'react';

interface Props {
  listHref: string;
  /** Saved name and code of the draft; null before step 1 creates it. */
  name: string | null;
  code: string | null;
  step: SewingCreateStep;
  ready: boolean;
  stepper: Omit<ComponentProps<typeof SewingCreateStepper>, 'step'>;
  exitDisabled: boolean;
  onExit: () => void;
  onBack: (() => void) | null;
  next: { label: string; busy: boolean; disabled: boolean; onClick: () => void };
  side: ReactNode;
  children: ReactNode;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/** «Нова модель» page frame: header, stepper, the step card with its footer and the side column. */
export function SewingCreateLayout(props: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Breadcrumbs aria-label="Шлях">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Довідники
        </Typography>
        <Link href={props.listHref} variant="body2" sx={{ color: 'primary.dark' }}>
          Товари
        </Link>
        <Typography variant="body2" aria-current="page">
          Нова модель
        </Typography>
      </Breadcrumbs>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ gap: 2, justifyContent: 'space-between', alignItems: { md: 'flex-start' } }}
      >
        <Stack sx={{ gap: 0.5, minWidth: 0 }}>
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <Typography variant="h4" component="h1" sx={{ overflowWrap: 'anywhere' }}>
              {props.name ?? 'Нова модель'}
            </Typography>
            {props.code && (
              <Typography variant="h6" component="span" sx={{ color: 'text.secondary', ...mono }}>
                {props.code}
              </Typography>
            )}
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {props.name === null ? 'Нова модель' : 'Чернетка збережена'} · крок {props.step} з 5
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}
        >
          <SewingCardStatusPill
            label={props.ready ? 'Готово до розрахунку' : 'Не готово до розрахунку'}
            tone={props.ready ? 'success' : 'warning'}
          />
          <Button variant="outlined" disabled={props.exitDisabled} onClick={props.onExit}>
            Зберегти і вийти
          </Button>
        </Stack>
      </Stack>
      <SewingCreateStepper step={props.step} {...props.stepper} />
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 330px' },
          alignItems: 'start',
        }}
      >
        <Card variant="outlined" component="section" aria-label="Крок">
          <CardContent sx={{ display: 'grid', gap: 2 }}>{props.children}</CardContent>
          <Divider />
          <Stack direction="row" sx={{ p: 2, gap: 1, justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={props.onBack ?? undefined}
              disabled={!props.onBack}
              sx={{ visibility: props.onBack ? 'visible' : 'hidden' }}
            >
              Назад
            </Button>
            <Button
              variant="contained"
              onClick={props.next.onClick}
              disabled={props.next.disabled || props.next.busy}
            >
              {props.next.busy ? 'Збереження…' : props.next.label}
            </Button>
          </Stack>
        </Card>
        <Stack component="aside" sx={{ gap: 2, position: { lg: 'sticky' }, top: { lg: 80 } }}>
          {props.side}
        </Stack>
      </Box>
    </Stack>
  );
}

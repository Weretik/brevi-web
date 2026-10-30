import { compareQuoteBasis } from '@admin/clients/model';
import {
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { quoteBlockerMessage } from './quote-blocker-message';

import type { QuotePriceBasis } from '@admin/clients/model';

const labels = { retail: 'Роздріб', wholesale: 'Опт', largeWholesale: 'Великий опт' } as const;
const format = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
const amount = (value: number | null) =>
  value === null ? 'Ціна недоступна' : format.format(value);

export function QuotePriceComparison({
  title,
  previous,
  next,
  context = 'reprice',
}: {
  title: string;
  previous: QuotePriceBasis;
  next: QuotePriceBasis;
  context?: 'reprice' | 'history';
}) {
  const comparison = compareQuoteBasis(previous, next);
  return (
    <Stack spacing={1}>
      <Typography component="h3" variant="subtitle1">
        {title}
      </Typography>
      {!comparison.selectionMatches && context === 'reprice' && (
        <Alert severity="error">Розрахунок не відповідає збереженому вибору.</Alert>
      )}
      {comparison.blocked && (
        <Alert severity="warning">
          {context === 'history'
            ? 'У порівнюваній версії є недоступні ціни.'
            : 'Перерахунок заблоковано: не всі ціни доступні. Збережена версія не зміниться.'}
        </Alert>
      )}
      {next.blockers.map((code) => (
        <Alert key={code} severity="warning">
          {quoteBlockerMessage(code)}
        </Alert>
      ))}
      {comparison.sourceChanged === true && (
        <Alert severity="info">Джерело або версія розрахунку змінилися.</Alert>
      )}
      {comparison.sourceChanged === false && (
        <Typography variant="caption">Джерела розрахунку не змінилися.</Typography>
      )}
      {comparison.sourceChanged === null && (
        <Typography variant="caption">Відомості для порівняння джерел відсутні.</Typography>
      )}
      {previous.source && next.source && (
        <Stack component="details" spacing={0.5} sx={{ overflowWrap: 'anywhere' }}>
          <Typography component="summary" variant="body2">
            Версії джерел розрахунку
          </Typography>
          <Typography variant="caption">
            Джерело: {previous.source.sourceId} → {next.source.sourceId}
          </Typography>
          <Typography variant="caption">
            Методика: {previous.source.formulaVersion} → {next.source.formulaVersion}
          </Typography>
          <Typography variant="caption">
            Правила: {previous.source.ruleVersionId ?? '—'} → {next.source.ruleVersionId ?? '—'}
          </Typography>
          <Typography variant="caption">
            Версія складу: {previous.source.compositionVersion ?? '—'} →{' '}
            {next.source.compositionVersion ?? '—'}
          </Typography>
          <Typography variant="caption">
            Налаштування: {previous.source.settingsVersionId ?? '—'} →{' '}
            {next.source.settingsVersionId ?? '—'}
          </Typography>
          <Typography variant="caption">
            Версії довідників:{' '}
            {[...previous.source.referenceVersionIds].sort((a, b) => a - b).join(', ') || '—'} →{' '}
            {[...next.source.referenceVersionIds].sort((a, b) => a - b).join(', ') || '—'}
          </Typography>
        </Stack>
      )}
      <TableContainer>
        <Table size="small" aria-label={`Порівняння цін: ${title}`}>
          <TableHead>
            <TableRow>
              <TableCell>Ціна</TableCell>
              <TableCell>{context === 'history' ? 'Попередня версія' : 'Збережено'}</TableCell>
              <TableCell>{context === 'history' ? 'Обрана версія' : 'Після перерахунку'}</TableCell>
              <TableCell>Зміна</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparison.prices.map((tier) => (
              <TableRow key={tier.tier}>
                <TableCell component="th" scope="row">
                  {labels[tier.tier]}
                </TableCell>
                <TableCell>{amount(tier.before)}</TableCell>
                <TableCell>{amount(tier.after)}</TableCell>
                <TableCell>{tier.changed ? 'Змінено' : 'Без змін'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

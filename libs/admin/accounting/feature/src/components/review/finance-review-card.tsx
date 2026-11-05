import {
  formatLedgerDate,
  formatSignedMinor,
  movementSourceLabels,
  transactionCounterpartyLabel,
  verificationProblemLabels,
} from '@admin/accounting/model';
import { FinanceProblemPill, FinanceTransactionReviewForm } from '@admin/accounting/ui';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';

import { useFinanceCounterpartySearch } from '../../hooks/counterparties/use-finance-counterparty-search';
import { useFinanceTransactionReview } from '../../hooks/review/use-finance-transaction-review';

import type { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import type { FinanceTransaction } from '@admin/accounting/model';

interface Props {
  transaction: FinanceTransaction;
  choices: ReturnType<typeof useFinanceChoices>;
  onSaved: (message: string) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** One operation of «Потребують перевірки», reviewed right in the list. */
export function FinanceReviewCard({ transaction, choices, onSaved }: Props) {
  const review = useFinanceTransactionReview(transaction, choices.categories, onSaved);
  const counterparties = useFinanceCounterpartySearch(true, (choice) =>
    review.change('counterparty', choice),
  );
  const keep = transaction.categoryId ?? '';
  const problem = verificationProblemLabels[transaction.verification];
  const label = transactionCounterpartyLabel(transaction);
  const source = [
    movementSourceLabels[transaction.source],
    label.name === '—' ? null : label.name,
  ].filter(Boolean);
  const titleId = `finance-review-${transaction.id}`;

  return (
    <Paper component="article" variant="outlined" aria-labelledby={titleId} sx={{ p: 2 }}>
      <Stack sx={{ gap: 1.5 }}>
        <Stack
          direction="row"
          sx={{ gap: 2, justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={mono}>
                {formatLedgerDate(transaction.date)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                · {transaction.accountName}
              </Typography>
              {problem && <FinanceProblemPill label={problem} />}
            </Stack>
            <Typography id={titleId} sx={{ mt: 0.75, fontWeight: 600 }}>
              {transaction.description || transaction.comment || 'Без опису'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {source.join(' · ')}
            </Typography>
          </Box>
          <Typography
            sx={{
              ...mono,
              fontWeight: 600,
              fontSize: '1.25rem',
              whiteSpace: 'nowrap',
              color: transaction.type === 'Income' ? 'success.main' : 'error.main',
            }}
          >
            {formatSignedMinor(transaction.type, transaction.amountMinor, transaction.currency)}
          </Typography>
        </Stack>
        {review.message && <Alert severity="error">{review.message}</Alert>}
        {counterparties.error && <Alert severity="error">{counterparties.error}</Alert>}
        {review.pending && (
          <Alert
            severity="warning"
            action={
              review.pending.canConfirm ? (
                <Button
                  color="inherit"
                  size="small"
                  disabled={review.pending.confirming}
                  onClick={review.confirmCounterparty}
                >
                  Підтвердити контрагента
                </Button>
              ) : undefined
            }
          >
            «{review.pending.name}» ще не підтверджений. Підтвердіть його або оберіть іншого.
          </Alert>
        )}
        <FinanceTransactionReviewForm
          formId={`${titleId}-form`}
          values={review.values}
          errors={review.errors}
          roots={choices.categoryChoices(transaction.type, null, keep)}
          children={
            review.values.rootId
              ? choices.categoryChoices(transaction.type, review.values.rootId, keep)
              : []
          }
          counterpartySearch={counterparties.field}
          saving={review.saving}
          rememberLabel={review.rememberLabel}
          remember={review.remember}
          onRememberChange={review.setRemember}
          onChange={review.change}
          onSubmit={() => void review.save()}
        />
      </Stack>
    </Paper>
  );
}

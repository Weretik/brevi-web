import {
  formatLedgerDate,
  formatSignedMinor,
  verificationProblemLabels,
} from '@admin/accounting/model';
import { FinanceProblemPill, FinanceTransactionReviewForm } from '@admin/accounting/ui';
import {
  ReferenceDetailsList,
  ReferenceEditorDrawer,
  ReferenceFormSection,
} from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';

import { useFinanceCounterpartySearch } from '../../hooks/counterparties/use-finance-counterparty-search';
import { useFinanceChoices } from '../../hooks/journal/use-finance-choices';
import { useFinanceTransactionReview } from '../../hooks/review/use-finance-transaction-review';

import type { FinanceTransaction } from '@admin/accounting/model';

interface Props {
  transaction: FinanceTransaction;
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** «Перевірити»: the date, account and amount stay; the category and counterparty change. */
export function FinanceReviewDrawer({ transaction, onClose, onSaved }: Props) {
  const choices = useFinanceChoices(transaction.scope);
  const review = useFinanceTransactionReview(transaction, choices.categories, onSaved);
  const counterparties = useFinanceCounterpartySearch(true, (choice) =>
    review.change('counterparty', choice),
  );
  const keep = transaction.categoryId ?? '';
  const problem = verificationProblemLabels[transaction.verification];

  return (
    <ReferenceEditorDrawer
      titleId="finance-review-drawer-title"
      title="Перевірка операції"
      description="Змінюються лише категорія і контрагент; дата, рахунок і сума лишаються."
      formId="finance-review-form"
      paperWidth={600}
      readOnly={false}
      saving={review.saving}
      submitLabel="Перевірено"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={review.save}
    >
      <Stack sx={{ gap: 2 }}>
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
                  Підтвердити
                </Button>
              ) : undefined
            }
          >
            «{review.pending.name}» ще не підтверджений. Підтвердіть його або оберіть іншого
            контрагента.
          </Alert>
        )}
        <FinanceTransactionReviewForm
          summary={
            <ReferenceFormSection title="Операція">
              {problem && <FinanceProblemPill label={problem} />}
              <ReferenceDetailsList
                items={[
                  { label: 'Дата', value: formatLedgerDate(transaction.date), mono: true },
                  { label: 'Рахунок', value: transaction.accountName },
                  {
                    label: 'Сума',
                    value: formatSignedMinor(
                      transaction.type,
                      transaction.amountMinor,
                      transaction.currency,
                    ),
                    mono: true,
                  },
                  { label: 'Опис', value: transaction.description },
                ]}
              />
            </ReferenceFormSection>
          }
          values={review.values}
          errors={review.errors}
          roots={choices.categoryChoices(transaction.type, null, keep)}
          children={
            review.values.rootId
              ? choices.categoryChoices(transaction.type, review.values.rootId, keep)
              : []
          }
          counterpartySearch={counterparties.field}
          onChange={review.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}

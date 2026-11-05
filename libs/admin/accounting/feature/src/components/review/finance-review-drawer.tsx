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

/**
 * «Перевірити» one operation from «Контрагенти → Разові»: the date, account and amount stay; the
 * category and counterparty change. «Потребують перевірки» reviews the same way in cards.
 */
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
      submitLabel="Підтвердити"
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
                  Підтвердити контрагента
                </Button>
              ) : undefined
            }
          >
            «{review.pending.name}» ще не підтверджений. Підтвердіть його або оберіть іншого.
          </Alert>
        )}
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
        <ReferenceFormSection title="Контрагент і категорія">
          <FinanceTransactionReviewForm
            layout="panel"
            formId="finance-review-form"
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
        </ReferenceFormSection>
      </Stack>
    </ReferenceEditorDrawer>
  );
}

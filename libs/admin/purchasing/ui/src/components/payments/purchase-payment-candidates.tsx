import { describePurchasePayment } from '@admin/purchasing/model';
import { Button, Stack, TextField, Typography } from '@mui/material';

import type { PurchasePaymentCandidate } from '@admin/purchasing/model';

interface CandidatesProps {
  search: string;
  candidates: readonly PurchasePaymentCandidate[];
  loading: boolean;
  error: string | null;
  busy: boolean;
  onSearch: (search: string) => void;
  onLink: (candidate: PurchasePaymentCandidate) => void;
  onCancel: () => void;
}

/**
 * «Прив'язати оплату»: expenses of the supplier (or equal to the invoice total) first; a search
 * by text or amount finds any expense. The ones equal to the invoice total are marked.
 */
export function PurchasePaymentCandidates({
  search,
  candidates,
  loading,
  error,
  busy,
  onSearch,
  onLink,
  onCancel,
}: CandidatesProps) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      <TextField
        size="small"
        label="Знайти витрату"
        placeholder="Опис або сума, наприклад 1 560,00"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      {!error && !loading && candidates.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {search.trim()
            ? 'Таких витрат немає.'
            : 'Витрат цього постачальника немає. Знайдіть витрату за описом або сумою.'}
        </Typography>
      )}
      {candidates.length > 0 && (
        <Stack component="ul" aria-label="Витрати для оплати" sx={{ m: 0, p: 0, gap: 1 }}>
          {candidates.map((candidate) => (
            <Stack
              key={candidate.transactionId}
              component="li"
              direction="row"
              sx={{ gap: 1, alignItems: 'center', listStyle: 'none' }}
            >
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2">{describePurchasePayment(candidate)}</Typography>
                {(candidate.counterpartyName || candidate.sameAmount) && (
                  <Typography variant="caption" color="text.secondary">
                    {[candidate.counterpartyName, candidate.sameAmount ? 'сума як у рахунку' : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </Typography>
                )}
              </Stack>
              <Button
                size="small"
                variant="outlined"
                disabled={busy}
                onClick={() => onLink(candidate)}
              >
                Привʼязати
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Закрити пошук</Button>
      </Stack>
    </Stack>
  );
}

import {
  bankDuplicateLabels,
  bankLineProblemLabels,
  transactionCounterpartyLabel,
} from '@admin/accounting/model';

import type { BankStatementLine } from '@admin/accounting/model';

/** Who the line is with: the picked counterparty, a one-off name, the own account, or the bank name. */
export function bankLineParty(line: BankStatementLine): { name: string; caption: string | null } {
  if (line.transferAccountName) return { name: line.transferAccountName, caption: 'Переказ' };
  if (line.counterparty || line.oneoffName) {
    const label = transactionCounterpartyLabel(line);
    return { name: label.name, caption: label.caption };
  }
  return {
    name: line.bankName || '—',
    caption: line.edrpou ? `ЄДРПОУ ${line.edrpou}` : null,
  };
}

/** The problems of a line to mark: a possible duplicate and a state that needs attention. */
export function bankLineProblems(line: BankStatementLine): string[] {
  const problems: string[] = [];
  if (line.duplicate !== 'None') problems.push(bankDuplicateLabels[line.duplicate]);
  const state = bankLineProblemLabels[line.state];
  if (state) problems.push(state);
  return problems;
}

import { counterpartyGroupLabels } from '@admin/accounting/model';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceCounterpartyChoice } from '@admin/accounting/model';

export interface FinanceCounterpartyPickerProps {
  value: FinanceCounterpartyChoice | null;
  /** Server matches of the typed text: finance counterparties, clients, suppliers. */
  options: FinanceCounterpartyChoice[];
  loading: boolean;
  error?: string;
  disabled?: boolean;
  onSearch: (text: string) => void;
  onChange: (choice: FinanceCounterpartyChoice | null) => void;
  /** «Додати «X» як фінансового»; left out hides the option. */
  onCreate?: (name: string) => void;
  /** A small field without the hint, for one-line forms. */
  compact?: boolean;
}

interface CreateOption {
  create: string;
}

type Option = FinanceCounterpartyChoice | CreateOption;

const isCreate = (option: Option): option is CreateOption => 'create' in option;
const same = (a: FinanceCounterpartyChoice, b: FinanceCounterpartyChoice) =>
  a.kind === b.kind && a.id === b.id;

/** «Контрагент» of an operation: one search over the three lists, grouped by kind. */
export function FinanceCounterpartyPicker({
  value,
  options,
  loading,
  error,
  disabled,
  onSearch,
  onChange,
  onCreate,
  compact = false,
}: FinanceCounterpartyPickerProps) {
  const [input, setInput] = useState('');
  const typed = input.trim();
  const choices: Option[] =
    value && !options.some((option) => same(option, value)) ? [value, ...options] : [...options];
  const exact = options.some((option) => option.name.toLowerCase() === typed.toLowerCase());
  if (onCreate && typed && !exact && typed !== value?.name) choices.push({ create: typed });

  return (
    <Autocomplete<Option>
      options={choices}
      value={value}
      size={compact ? 'small' : 'medium'}
      disabled={disabled}
      loading={loading}
      groupBy={(option) =>
        isCreate(option) ? 'Новий контрагент' : counterpartyGroupLabels[option.kind]
      }
      getOptionLabel={(option) => (isCreate(option) ? option.create : option.name)}
      getOptionKey={(option) => (isCreate(option) ? 'create' : `${option.kind}:${option.id}`)}
      isOptionEqualToValue={(option, current) =>
        !isCreate(option) && !isCreate(current) && same(option, current)
      }
      filterOptions={(all) => all}
      noOptionsText="Почніть вводити назву або ЄДРПОУ"
      loadingText="Шукаємо…"
      onInputChange={(_event, text, reason) => {
        setInput(text);
        if (reason === 'input') onSearch(text);
      }}
      onChange={(_event, option) => {
        if (option && isCreate(option)) onCreate?.(option.create);
        else onChange(option);
      }}
      renderOption={({ key, ...props }, option) => (
        <li key={key} {...props}>
          {isCreate(option) ? (
            <Typography variant="body2">
              Додати «{option.create}» як фінансового контрагента
            </Typography>
          ) : (
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center', width: '100%' }}>
              <Stack sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2">{option.name}</Typography>
                {option.hint && (
                  <Typography variant="caption" color="text.secondary">
                    {option.hint}
                  </Typography>
                )}
              </Stack>
              {!option.verified && <FinanceProblemPill label="Не підтверджено" />}
            </Stack>
          )}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Контрагент"
          error={Boolean(error)}
          helperText={
            error ??
            (compact ? undefined : 'Фінансовий контрагент, клієнт або постачальник; необовʼязково.')
          }
        />
      )}
    />
  );
}

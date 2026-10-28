import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';

export function QuoteListFilters({
  search,
  state,
  canCreate,
  onSearch,
  onState,
  onCreate,
}: {
  search: string;
  state: string;
  canCreate: boolean;
  onSearch: (value: string) => void;
  onState: (value: string) => void;
  onCreate: () => void;
}) {
  const [input, setInput] = useState(search);
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(input.trim().slice(0, 300));
      }}
    >
      <TextField
        label="Пошук КП"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <TextField
        select
        label="Стан КП"
        value={state}
        onChange={(event) => onState(event.target.value)}
      >
        <MenuItem value="">Усі стани</MenuItem>
        <MenuItem value="draft">Чернетки</MenuItem>
        <MenuItem value="ready">Готові</MenuItem>
        <MenuItem value="sent">Надіслані</MenuItem>
      </TextField>
      <Button type="submit">Знайти КП</Button>
      <Button variant="contained" disabled={!canCreate} onClick={onCreate}>
        Створити КП
      </Button>
    </Stack>
  );
}

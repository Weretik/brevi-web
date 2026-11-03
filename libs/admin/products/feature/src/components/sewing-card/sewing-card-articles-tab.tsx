import { SewingArticleCreateForm, SewingArticleSummaryGrid } from '@admin/products/ui';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';

import type { SewingArticleCreateDraft, SewingArticleSummaryRow } from '@admin/products/model';

interface Props {
  rows: SewingArticleSummaryRow[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  canCreate: boolean;
  version: number;
  creating: boolean;
  createError: string | null;
  onCreate: (draft: SewingArticleCreateDraft) => void;
  onOpen: (articleId: number) => void;
}

/** «Артикули»: site Articles with live cost, three prices and the calculation status. */
export function SewingCardArticlesTab(props: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      {props.error && (
        <Alert severity="error" action={<Button onClick={props.onRetry}>Повторити</Button>}>
          {props.error}
        </Alert>
      )}
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Ціни рахуються зараз із поточної комплектації, трудовитрат і параметрів ціноутворення.
        Відкрийте артикул, щоб зберегти розрахунок і опублікувати ціну.
      </Typography>
      <SewingArticleSummaryGrid rows={props.rows} loading={props.loading} onOpen={props.onOpen} />
      {props.canCreate && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="h6" component="h2">
              Новий артикул
            </Typography>
            {props.createError && <Alert severity="error">{props.createError}</Alert>}
            <SewingArticleCreateForm
              version={props.version}
              nextSortOrder={props.rows.length}
              creating={props.creating}
              onCreate={props.onCreate}
            />
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

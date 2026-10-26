import { Alert, Stack, Typography } from '@mui/material';

import { SewingArticleCreateForm } from './sewing-article-create-form';
import { SewingArticleList } from '../../components/sewing-articles/sewing-article-list';

import type { SewingArticle, SewingArticleCreateDraft } from '@admin/products/model';

interface Props {
  articles: SewingArticle[];
  selectedArticleId: number | null;
  version: number;
  canManage: boolean;
  creating?: boolean;
  error?: string | null;
  onSelect: (id: number) => void;
  onCreate: (draft: SewingArticleCreateDraft) => void;
}
export function SewingArticlesPanel({
  articles,
  selectedArticleId,
  version,
  canManage,
  creating = false,
  error,
  onSelect,
  onCreate,
}: Props) {
  return (
    <Stack component="section" aria-labelledby="sewing-articles-heading" sx={{ gap: 2 }}>
      <Typography id="sewing-articles-heading" variant="h6" component="h2">
        Артикули продажу
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {articles.length === 0 ? (
        <Typography color="text.secondary">Артикулів ще немає.</Typography>
      ) : (
        <SewingArticleList
          articles={articles}
          selectedArticleId={selectedArticleId}
          onSelect={onSelect}
        />
      )}
      {canManage && (
        <SewingArticleCreateForm
          version={version}
          nextSortOrder={articles.length}
          creating={creating}
          onCreate={onCreate}
        />
      )}
    </Stack>
  );
}

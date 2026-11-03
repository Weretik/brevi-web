import { ReferenceFilterChip } from '@admin/references/ui';
import { Stack, Typography } from '@mui/material';

import type { SewingArticle } from '@admin/products/model';

interface Props {
  scope: 'Model' | 'Article';
  articles: SewingArticle[];
  selectedArticleId: number | null;
  onSelectModel: () => void;
  onSelectArticle: (id: number) => void;
}

/**
 * Switch between the shared materials of the model and one Article's own materials, as the sheet
 * column «Артикул сайту» in «Комплектація виробів» (empty = shared for all Articles).
 */
export function CompositionScopeChips({
  scope,
  articles,
  selectedArticleId,
  onSelectModel,
  onSelectArticle,
}: Props) {
  return (
    <Stack sx={{ gap: 1 }}>
      <Stack
        role="group"
        aria-label="Чия комплектація"
        direction="row"
        sx={{ gap: 1, flexWrap: 'wrap' }}
      >
        <ReferenceFilterChip
          label="Спільна для всіх артикулів"
          selected={scope === 'Model'}
          onClick={onSelectModel}
        />
        {articles.map((article) => (
          <ReferenceFilterChip
            key={article.id}
            label={`Артикул ${article.saleSku}`}
            selected={scope === 'Article' && selectedArticleId === article.id}
            onClick={() => onSelectArticle(article.id)}
          />
        ))}
      </Stack>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {scope === 'Model'
          ? 'Матеріали, однакові для всіх артикулів: фурнітура, підкладка, синтепон.'
          : 'Матеріали лише цього артикулу, зазвичай його тканина. Спільні показано нижче для перегляду.'}
      </Typography>
    </Stack>
  );
}

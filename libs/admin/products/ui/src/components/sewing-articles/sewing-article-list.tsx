import { List, ListItemButton, ListItemText } from '@mui/material';

import type { SewingArticle } from '@admin/products/model';

interface Props {
  articles: SewingArticle[];
  selectedArticleId: number | null;
  onSelect: (id: number) => void;
}
export function SewingArticleList({ articles, selectedArticleId, onSelect }: Props) {
  return (
    <List aria-label="Артикули товару" disablePadding>
      {[...articles]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((article) => (
          <ListItemButton
            key={article.id}
            selected={article.id === selectedArticleId}
            onClick={() => onSelect(article.id)}
            aria-label={`Артикул ${article.saleSku}${article.active ? ', активний' : ', неактивний'}`}
          >
            <ListItemText
              primary={article.saleSku}
              secondary={
                <>
                  {article.active ? 'Активний' : 'Неактивний'}
                  {article.readiness &&
                    (article.readiness.ready
                      ? ' · Готовий до розрахунку'
                      : ` · Потрібна перевірка: ${article.readiness.blockers.join('; ')}`)}
                  {!article.readiness && ' · Готовність не перевірена · оберіть артикул'}
                </>
              }
            />
          </ListItemButton>
        ))}
    </List>
  );
}

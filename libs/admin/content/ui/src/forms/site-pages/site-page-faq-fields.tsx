import { sitePageLimits } from '@admin/content/model';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';

import type { SiteFaqItem } from '@admin/content/model';

interface Props {
  items: SiteFaqItem[];
  disabled: boolean;
  onChange: (items: SiteFaqItem[]) => void;
}

/**
 * Frequent questions of a page in the order the site shows them. The answer is one paragraph of plain text,
 * because search engines read it as is.
 */
export function SitePageFaqFields({ items, disabled, onChange }: Props) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Запитань немає: сайт показує свої, якщо вони є. Для пошуку добре 3–5 запитань.
      </Typography>
    );
  }

  const change = (index: number, patch: Partial<SiteFaqItem>) =>
    onChange(items.map((item, at) => (at === index ? { ...item, ...patch } : item)));
  const move = (index: number, by: -1 | 1) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    onChange(next);
  };

  return (
    <Stack sx={{ gap: 2.5 }}>
      {items.map((item, index) => (
        <Stack key={index} sx={{ gap: 1.5 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle2" sx={{ flex: 1 }}>
              Запитання {index + 1}
            </Typography>
            <Tooltip title="Вище">
              <span>
                <IconButton
                  size="small"
                  aria-label={`Запитання ${index + 1} вище`}
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUpwardOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Нижче">
              <span>
                <IconButton
                  size="small"
                  aria-label={`Запитання ${index + 1} нижче`}
                  disabled={disabled || index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDownwardOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Видалити">
              <span>
                <IconButton
                  size="small"
                  aria-label={`Видалити запитання ${index + 1}`}
                  disabled={disabled}
                  onClick={() => onChange(items.filter((_, at) => at !== index))}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          <TextField
            label="Запитання"
            value={item.question}
            disabled={disabled}
            slotProps={{ htmlInput: { maxLength: sitePageLimits.question } }}
            onChange={(event) => change(index, { question: event.target.value })}
            fullWidth
          />
          <TextField
            label="Відповідь"
            value={item.answer}
            disabled={disabled}
            multiline
            minRows={2}
            slotProps={{ htmlInput: { maxLength: sitePageLimits.answer } }}
            onChange={(event) => change(index, { answer: event.target.value })}
            fullWidth
          />
        </Stack>
      ))}
    </Stack>
  );
}

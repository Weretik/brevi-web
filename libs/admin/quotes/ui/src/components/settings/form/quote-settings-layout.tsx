import { Box, Card, Stack, Typography } from '@mui/material';

import type { QuoteSettingsErrors, QuoteSettingsSection } from '@admin/quotes/model';
import type { ReactNode } from 'react';

/** A picture field the page fills: a link plus «Фото» from the library. */
export type QuoteImageFieldRender = (field: {
  label: string;
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
  /** What the picture should be, under the field. */
  hint?: string;
  /** Shows «Завантажити» for a file from the computer. */
  upload?: boolean;
}) => ReactNode;

/** The page anchor of a section, used by the section list. */
export const quoteSettingsAnchor = (id: string) => `quote-settings-${id}`;

interface SectionProps {
  section: QuoteSettingsSection;
  changed: boolean;
  errorCount: number;
  children: ReactNode;
}

/** One section of the page: a title, what it is for, and a mark only when it changed or has problems. */
export function QuoteSettingsSectionCard({ section, changed, errorCount, children }: SectionProps) {
  return (
    <Card
      variant="outlined"
      component="section"
      id={quoteSettingsAnchor(section.id)}
      aria-label={section.title}
      sx={{ p: { xs: 2, md: 2.5 }, scrollMarginTop: 88 }}
    >
      <Stack
        direction="row"
        sx={{ gap: 1, alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{ fontSize: '1.125rem', fontWeight: 700 }}
        >
          {section.title}
        </Typography>
        {errorCount > 0 ? (
          <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
            {quoteSettingsProblemsLabel(errorCount)}
          </Typography>
        ) : changed ? (
          <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
            Змінено
          </Typography>
        ) : null}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
        {section.description}
      </Typography>
      <Stack sx={{ gap: 2.5 }}>{children}</Stack>
    </Card>
  );
}

/** «1 помилка», «2 помилки», «5 помилок». */
export function quoteSettingsProblemsLabel(count: number): string {
  const tens = count % 100;
  const ones = count % 10;
  const word =
    ones === 1 && tens !== 11
      ? 'помилка'
      : ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)
        ? 'помилки'
        : 'помилок';
  return `${count} ${word}`;
}

/** A named group of fields inside a section, such as «Блок унизу сторінки». */
export function QuoteSettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography
        variant="overline"
        component="h3"
        color="text.secondary"
        sx={{ display: 'block', fontWeight: 600, lineHeight: 1.6, mb: 1 }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

/** Grid of fields: one column on phones, `columns` on wide screens. */
export function QuoteSettingsGrid({
  columns = 2,
  children,
}: {
  columns?: number;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: '1fr', md: `repeat(${columns}, minmax(0, 1fr))` },
      }}
    >
      {children}
    </Box>
  );
}

/** Error lookup for one section: `at('name')` reads `<prefix>.name`. */
export const errorsAt =
  (errors: QuoteSettingsErrors, prefix: string) =>
  (field: string): string | undefined =>
    errors[`${prefix}.${field}`];

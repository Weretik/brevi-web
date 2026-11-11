import { useGetSeoOverviewQuery } from '@admin/content/data-access';
import {
  seoAreaLabels,
  seoAreas,
  seoProblemKinds,
  seoProblemLabels,
  seoSiteProblemLabels,
} from '@admin/content/model';
import { SeoIssuesTable } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  articlesPath,
  contentProductsPath,
  seoSettingsPath,
  siteCategoriesPath,
  sitePagesPath,
} from '../../model/content-paths';

import type { SeoArea, SeoIssue, SeoProblemKind } from '@admin/content/model';

const noIssues: SeoIssue[] = [];

const areaPaths: Record<SeoArea, string> = {
  Product: contentProductsPath,
  Category: siteCategoriesPath,
  Article: articlesPath,
  Page: sitePagesPath,
};

/**
 * «Контент → SEO-огляд»: what the public site still misses for search, read-only. Only problems are shown; a row
 * opens the section where the page is fixed.
 */
export function SeoOverviewContent() {
  const overview = useGetSeoOverviewQuery(undefined, { refetchOnMountOrArgChange: true });
  const navigate = useNavigate();
  const [area, setArea] = useState<SeoArea | null>(null);
  const [problem, setProblem] = useState<SeoProblemKind | null>(null);
  const data = overview.currentData;
  const issues = data?.issues ?? noIssues;
  const shown = useMemo(
    () =>
      issues.filter(
        (issue) =>
          (area === null || issue.area === area) &&
          (problem === null || issue.problems.some((x) => x.kind === problem)),
      ),
    [issues, area, problem],
  );

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="SEO-огляд"
        actions={null}
        subtitle="Що сайту ще бракує для пошуку Google і Bing. Показано лише сторінки, які видно на сайті, і лише проблеми; натисніть рядок, щоб виправити."
      />
      <ReferenceListAlerts
        error={
          overview.error
            ? adminApiErrorMessage(overview.error, 'Не вдалося завантажити SEO-огляд.')
            : null
        }
        loading={overview.isLoading}
        onRetry={() => void overview.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {data && data.siteProblems.length > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" component={RouterLink} to={seoSettingsPath}>
              Відкрити налаштування
            </Button>
          }
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Налаштування SEO сайту
          </Typography>
          {data.siteProblems.map((x) => (
            <Typography key={x} variant="body2">
              {seoSiteProblemLabels[x]}
            </Typography>
          ))}
        </Alert>
      )}
      {data && (
        <Stack direction="row" useFlexGap sx={{ gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
          {data.areas.map((summary) => (
            <Paper
              key={summary.area}
              variant="outlined"
              sx={{ px: 2, py: 1.25, minWidth: 180, flex: '1 1 180px' }}
            >
              <Typography variant="caption" color="text.secondary">
                {seoAreaLabels[summary.area]}
              </Typography>
              <Typography variant="body2">На сайті: {summary.onSite}</Typography>
              {summary.withProblems > 0 && (
                <Typography variant="body2" color="warning.dark">
                  З проблемами: {summary.withProblems}
                </Typography>
              )}
            </Paper>
          ))}
        </Stack>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5, mb: 2 }}>
        <TextField
          select
          size="small"
          label="Розділ"
          value={area ?? ''}
          onChange={(event) =>
            setArea(event.target.value === '' ? null : (event.target.value as SeoArea))
          }
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Усі</MenuItem>
          {seoAreas.map((value) => (
            <MenuItem key={value} value={value}>
              {seoAreaLabels[value]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Проблема"
          value={problem ?? ''}
          onChange={(event) =>
            setProblem(event.target.value === '' ? null : (event.target.value as SeoProblemKind))
          }
          sx={{ minWidth: 280 }}
        >
          <MenuItem value="">Усі</MenuItem>
          {seoProblemKinds.map((value) => (
            <MenuItem key={value} value={value}>
              {seoProblemLabels[value]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <SeoIssuesTable
          rows={shown}
          loading={overview.isFetching}
          narrowed={area !== null || problem !== null}
          unavailable={Boolean(overview.error)}
          onOpen={(issue) => void navigate(areaPaths[issue.area])}
        />
      </Paper>
    </Box>
  );
}

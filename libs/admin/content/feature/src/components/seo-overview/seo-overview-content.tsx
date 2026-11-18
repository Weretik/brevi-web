import { useGetSeoOverviewQuery } from '@admin/content/data-access';
import { SeoIssuesTable } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Box, Paper } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SeoOverviewFilters } from './seo-overview-filters';
import { SeoOverviewSummary } from './seo-overview-summary';
import {
  articlesPath,
  contentProductsPath,
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
      {data && <SeoOverviewSummary data={data} />}
      <SeoOverviewFilters area={area} problem={problem} onArea={setArea} onProblem={setProblem} />
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

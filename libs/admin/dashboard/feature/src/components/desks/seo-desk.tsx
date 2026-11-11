import { useGetSeoOverviewQuery } from '@admin/content/data-access';
import { seoSiteProblemLabels } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { seoAreaPaths, seoFixList, seoMetrics } from '../../model/seo-view';
import { DeskListCard } from '../desk-list/desk-list-card';
import { MetricStrip } from '../metrics/metric-strip';

import type { DashboardViewer } from '../../model/dashboard-view';

const seoOverviewPath = '/content/seo-overview';

interface SeoDeskProps {
  viewer: DashboardViewer;
}

/**
 * «Робочий стіл SEO» (DESK-001 stage 3): the short «SEO-огляд» (what the site still misses for search) with the
 * sections where it is fixed. Each block and button needs its own page of «Права доступу».
 */
export function SeoDesk({ viewer }: SeoDeskProps) {
  const sees = {
    overview: viewer.canSee('content-seo-overview'),
    settings: viewer.canSee('content-seo-settings'),
    products: viewer.canSee('content-products'),
    articles: viewer.canSee('content-articles'),
    pages: viewer.canSee('content-site-pages'),
    media: viewer.canSee('media'),
  };
  const overview = useGetSeoOverviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !sees.overview,
  });
  const data = overview.data;
  const fix = data ? seoFixList(data) : null;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.25 }}>
        {sees.products && (
          <Button component={RouterLink} to={seoAreaPaths.Product} variant="outlined">
            Товари сайту
          </Button>
        )}
        {sees.articles && (
          <Button component={RouterLink} to={seoAreaPaths.Article} variant="outlined">
            Статті
          </Button>
        )}
        {sees.pages && (
          <Button component={RouterLink} to={seoAreaPaths.Page} variant="outlined">
            Сторінки сайту
          </Button>
        )}
        {sees.media && (
          <Button component={RouterLink} to="/media" variant="outlined">
            Бібліотека фото
          </Button>
        )}
      </Stack>
      {!sees.overview && (
        <Typography color="text.secondary">
          Для огляду сайту потрібне право на «Контент → SEO-огляд».
        </Typography>
      )}
      {overview.error && (
        <Alert severity="error">
          {adminApiErrorMessage(overview.error, 'Не вдалося завантажити SEO-огляд.')}
        </Alert>
      )}
      {data && data.siteProblems.length > 0 && (
        <Alert
          action={
            sees.settings ? (
              <Button
                color="inherit"
                component={RouterLink}
                size="small"
                to="/content/seo-settings"
              >
                Відкрити налаштування
              </Button>
            ) : undefined
          }
          severity="warning"
        >
          <Typography sx={{ fontWeight: 600 }} variant="body2">
            Налаштування SEO сайту
          </Typography>
          {data.siteProblems.map((problem) => (
            <Typography key={problem} variant="body2">
              {seoSiteProblemLabels[problem]}
            </Typography>
          ))}
        </Alert>
      )}
      {data && <MetricStrip metrics={seoMetrics(data)} />}
      {fix && fix.rows.length > 0 && (
        <Box sx={{ maxWidth: 960 }}>
          <DeskListCard
            id="seo-fix"
            link={{ label: 'SEO-огляд', to: seoOverviewPath }}
            list={fix}
            moreText={(more) => `І ще ${more} — у «SEO-огляд».`}
            title="Що виправити для пошуку"
          />
        </Box>
      )}
    </Stack>
  );
}

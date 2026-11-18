import { seoAreaLabels, seoSiteProblemLabels } from '@admin/content/model';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { seoSettingsPath } from '../../model/content-paths';

import type { SeoOverview } from '@admin/content/model';

/** Problems of the site SEO settings, then one card per area with the pages on the site and those with problems. */
export function SeoOverviewSummary({ data }: { data: SeoOverview }) {
  return (
    <>
      {data.siteProblems.length > 0 && (
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
    </>
  );
}

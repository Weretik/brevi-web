import {
  embroideryCalculationHref,
  embroideryChoiceText,
  embroideryMaterialsText,
} from '@admin/production/model';
import { Box, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import type { ItemApplication } from '@admin/production/model';

interface Props {
  applications: readonly ItemApplication[];
  /** Managers and Admin open «Ціна вишивки»; the workshop reads the details here. */
  canOpenCalculation: boolean;
}

/** The «Ціна вишивки» calculations of an item's embroideries: design, hoop, materials and mockup. */
export function ProductionItemEmbroideries({ applications, canOpenCalculation }: Props) {
  const linked = applications.filter((x) => x.embroideryCalculationId !== null);
  if (linked.length === 0) return null;

  return (
    <Stack sx={{ gap: 1.5, mt: 2 }} aria-label="Розрахунки вишивки">
      {linked.map((application, index) => {
        const embroidery = application.embroidery;
        const id = application.embroideryCalculationId as number;
        const number = embroidery?.number ?? application.embroideryNumber ?? 'Розрахунок';
        const title = embroidery?.name ? `${number} · ${embroidery.name}` : number;
        const mockup = embroidery?.mockupThumbnailUrl ?? embroidery?.mockupUrl ?? null;
        return (
          <Stack
            key={`${id}-${index}`}
            direction="row"
            sx={{ gap: 1.5, p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            {mockup && embroidery && (
              <Link
                href={embroidery.mockupUrl ?? mockup}
                target="_blank"
                rel="noopener"
                aria-label={`Макет ${number}`}
              >
                <Box
                  component="img"
                  src={mockup}
                  alt={`Макет ${number}`}
                  sx={{
                    display: 'block',
                    width: 72,
                    height: 72,
                    objectFit: 'contain',
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                  }}
                />
              </Link>
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2">
                Вишивка:{' '}
                {canOpenCalculation && embroidery ? (
                  <Link component={RouterLink} to={embroideryCalculationHref(id)}>
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </Typography>
              {embroidery ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    {embroideryChoiceText(embroidery)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {embroideryMaterialsText(embroidery)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="warning.main">
                  Розрахунок видалено з «Ціна вишивки»; деталі недоступні.
                </Typography>
              )}
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}

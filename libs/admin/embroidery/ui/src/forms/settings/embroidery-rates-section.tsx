import { formatEmbroideryMoney } from '@admin/embroidery/model';
import { Alert, Box, Link, Typography } from '@mui/material';

import { EmbroideryFormCard } from '../embroidery-form-card';
import { EmbroideryNumberField } from '../embroidery-number-field';

import type {
  EmbroiderySettings,
  EmbroiderySettingsDraft,
  EmbroiderySettingsErrors,
} from '@admin/embroidery/model';

interface Props {
  rates: EmbroiderySettingsDraft['rates'];
  stitchRate: EmbroiderySettings['stitchRate'];
  /** «Параметри ціноутворення», where the stitch rate is edited. */
  pricingParametersHref: string;
  errors: EmbroiderySettingsErrors;
  onChange: (patch: Partial<EmbroiderySettingsDraft['rates']>) => void;
}

const grid = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
};

/** «Ставки»: the stitch rate from «Параметри ціноутворення» (read-only) and the page's own rates. */
export function EmbroideryRatesSection({
  rates,
  stitchRate,
  pricingParametersHref,
  errors,
  onChange,
}: Props) {
  return (
    <EmbroideryFormCard title="Ставки" id="embroidery-settings-rates">
      {stitchRate.value === null ? (
        <Alert severity="warning">
          Оплату вишивки за 1000 стібків не задано, тому ціну не можна порахувати.{' '}
          <Link href={pricingParametersHref}>Задати в «Параметрах ціноутворення»</Link>
        </Alert>
      ) : (
        <Box>
          <Typography variant="overline" color="text.secondary" component="p">
            Оплата вишивальниці за 1000 стежків
          </Typography>
          <Typography sx={{ fontFamily: 'var(--admin-font-mono)', fontSize: 22, fontWeight: 600 }}>
            {formatEmbroideryMoney(stitchRate.value)} грн
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Береться з «Параметрів ціноутворення».{' '}
            <Link href={pricingParametersHref}>Змінити там</Link>
          </Typography>
        </Box>
      )}
      <Box sx={grid}>
        <EmbroideryNumberField
          label="Нитки за 1000 стежків"
          unit="грн"
          value={rates.threadRate}
          error={errors['rates.threadRate']}
          onChange={(threadRate) => onChange({ threadRate })}
        />
        <EmbroideryNumberField
          label="Одне зап’ялювання"
          unit="грн"
          value={rates.hoopingRate}
          error={errors['rates.hoopingRate']}
          onChange={(hoopingRate) => onChange({ hoopingRate })}
        />
        <EmbroideryNumberField
          label="Година розробки програми"
          unit="грн"
          value={rates.programHourRate}
          error={errors['rates.programHourRate']}
          onChange={(programHourRate) => onChange({ programHourRate })}
        />
        <EmbroideryNumberField
          label="Податкове навантаження"
          unit="%"
          value={rates.taxPercent}
          error={errors['rates.taxPercent']}
          helperText="Додається після націнки."
          onChange={(taxPercent) => onChange({ taxPercent })}
        />
      </Box>
    </EmbroideryFormCard>
  );
}

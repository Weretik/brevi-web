import { weekDayLabels } from '@admin/content/model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { companyFormGrid } from '../company-form-grid';
import { CompanyFormTitle } from '../company-form-title';
import { CompanyTwoLanguagesField } from '../company-two-languages-field';

import type { CompanyFormSectionProps } from './company-form-section';

/** «Звʼязок і адреса»: phone, email, address, map search and working hours. */
export function CompanyContactFields({ values, errors, disabled, set }: CompanyFormSectionProps) {
  return (
    <>
      <CompanyFormTitle>Звʼязок і адреса</CompanyFormTitle>
      <Box sx={companyFormGrid}>
        <TextField
          label="Телефон компанії"
          value={values.phone}
          disabled={disabled}
          error={Boolean(errors['phone'])}
          helperText={errors['phone'] ?? 'Показується в шапці сайту й на кнопці «Подзвонити».'}
          onChange={(event) => set('phone', event.target.value)}
        />
        <TextField
          label="Пошта"
          value={values.email}
          disabled={disabled}
          error={Boolean(errors['email'])}
          helperText={errors['email']}
          onChange={(event) => set('email', event.target.value)}
        />
      </Box>
      <CompanyTwoLanguagesField
        label="Місто"
        value={values.city}
        error={errors['city']}
        disabled={disabled}
        onChange={(value) => set('city', value)}
      />
      <CompanyTwoLanguagesField
        label="Вулиця"
        value={values.street}
        error={errors['street']}
        disabled={disabled}
        onChange={(value) => set('street', value)}
      />
      <TextField
        label="Пошук на мапі"
        value={values.mapQuery}
        disabled={disabled}
        error={Boolean(errors['mapQuery'])}
        helperText={errors['mapQuery'] ?? 'Що мапа шукає, щоб показати офіс.'}
        onChange={(event) => set('mapQuery', event.target.value)}
      />
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="body2">Робочі дні</Typography>
        <FormGroup row>
          {weekDayLabels.map((label, i) => {
            const day = i + 1;
            return (
              <FormControlLabel
                key={label}
                label={label}
                disabled={disabled}
                control={
                  <Checkbox
                    checked={values.days.includes(day)}
                    onChange={(event) =>
                      set(
                        'days',
                        event.target.checked
                          ? [...values.days, day]
                          : values.days.filter((d) => d !== day),
                      )
                    }
                  />
                }
              />
            );
          })}
        </FormGroup>
        {errors['days'] && <FormHelperText error>{errors['days']}</FormHelperText>}
      </Stack>
      <Box sx={companyFormGrid}>
        <TextField
          label="Початок"
          type="time"
          value={values.opens}
          disabled={disabled}
          error={Boolean(errors['hours'])}
          helperText={errors['hours']}
          onChange={(event) => set('opens', event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Кінець"
          type="time"
          value={values.closes}
          disabled={disabled}
          error={Boolean(errors['hours'])}
          onChange={(event) => set('closes', event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
    </>
  );
}

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, FormHelperText, Paper, Stack, TextField } from '@mui/material';

import { CompanyManagerToolbar } from './company-manager-toolbar';
import { companyFormGrid } from '../form/company-form-grid';
import { CompanyFormTitle } from '../form/company-form-title';
import { CompanyTwoLanguagesField } from '../form/company-two-languages-field';

import type { CompanyFormSectionProps } from './company-form-section';
import type { CompanyManagerFormValues } from '@admin/content/model';

/** «Менеджери на сторінці «Контакти»»: order, photo, name, phones and email of each manager. */
export function CompanyManagersFields({
  values,
  errors,
  disabled,
  set,
  onPickPhoto,
  onAddManager,
}: CompanyFormSectionProps & {
  /** Opens the «Фото» library for the photo of the manager at this place. */
  onPickPhoto: (index: number) => void;
  onAddManager: () => void;
}) {
  const setManager = (index: number, manager: CompanyManagerFormValues) =>
    set(
      'managers',
      values.managers.map((m, i) => (i === index ? manager : m)),
    );
  const move = (index: number, by: number) => {
    const managers = [...values.managers];
    const [moved] = managers.splice(index, 1);
    managers.splice(index + by, 0, moved);
    set('managers', managers);
  };

  return (
    <>
      <CompanyFormTitle>Менеджери на сторінці «Контакти»</CompanyFormTitle>
      {values.managers.map((manager, index) => {
        const key = `managers.${index}`;
        return (
          <Paper key={index} variant="outlined" sx={{ p: 2 }}>
            <Stack sx={{ gap: 2 }}>
              <CompanyManagerToolbar
                manager={manager}
                disabled={disabled}
                first={index === 0}
                last={index === values.managers.length - 1}
                onPickPhoto={() => onPickPhoto(index)}
                onClearPhoto={() => setManager(index, { ...manager, photoUrl: null })}
                onMove={(by) => move(index, by)}
                onRemove={() =>
                  set(
                    'managers',
                    values.managers.filter((_, i) => i !== index),
                  )
                }
              />
              <CompanyTwoLanguagesField
                label="Імʼя"
                value={manager.name}
                error={errors[`${key}.name`]}
                disabled={disabled}
                onChange={(name) => setManager(index, { ...manager, name })}
              />
              <Box sx={companyFormGrid}>
                <TextField
                  label="Телефони"
                  value={manager.phones}
                  disabled={disabled}
                  error={Boolean(errors[`${key}.phones`])}
                  helperText={errors[`${key}.phones`] ?? 'До трьох, через кому.'}
                  onChange={(event) =>
                    setManager(index, { ...manager, phones: event.target.value })
                  }
                />
                <TextField
                  label="Пошта"
                  value={manager.email}
                  disabled={disabled}
                  error={Boolean(errors[`${key}.email`])}
                  helperText={errors[`${key}.email`] ?? 'Необовʼязково.'}
                  onChange={(event) => setManager(index, { ...manager, email: event.target.value })}
                />
              </Box>
            </Stack>
          </Paper>
        );
      })}
      {errors['managers'] && <FormHelperText error>{errors['managers']}</FormHelperText>}
      <Box>
        <Button startIcon={<AddIcon />} disabled={disabled} onClick={onAddManager}>
          Додати менеджера
        </Button>
      </Box>
    </>
  );
}

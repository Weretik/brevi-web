import { managerPhotoSrc } from '@admin/content/model';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import { companyFormGrid } from '../company-form-grid';
import { CompanyFormTitle } from '../company-form-title';
import { CompanyTwoLanguagesField } from '../company-two-languages-field';

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
              <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                <Avatar src={managerPhotoSrc(manager.photoUrl)} sx={{ width: 48, height: 48 }}>
                  {manager.name.uk.slice(0, 1)}
                </Avatar>
                <Button size="small" disabled={disabled} onClick={() => onPickPhoto(index)}>
                  {manager.photoUrl ? 'Змінити фото' : 'Обрати фото'}
                </Button>
                {manager.photoUrl && (
                  <Button
                    size="small"
                    color="inherit"
                    disabled={disabled}
                    onClick={() => setManager(index, { ...manager, photoUrl: null })}
                  >
                    Прибрати фото
                  </Button>
                )}
                <Box sx={{ flex: 1 }} />
                <Tooltip title="Вище">
                  <span>
                    <IconButton
                      size="small"
                      aria-label="Вище"
                      disabled={disabled || index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Нижче">
                  <span>
                    <IconButton
                      size="small"
                      aria-label="Нижче"
                      disabled={disabled || index === values.managers.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Прибрати менеджера">
                  <IconButton
                    size="small"
                    aria-label="Прибрати менеджера"
                    disabled={disabled}
                    onClick={() =>
                      set(
                        'managers',
                        values.managers.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
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

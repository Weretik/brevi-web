import { weekDayLabels } from '@admin/content/model';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { managerPhotoSrc } from '../../components/company/site-company-view';

import type {
  CompanyManagerFormValues,
  CompanyText,
  SiteCompanyErrors,
  SiteCompanyFormValues,
} from '@admin/content/model';

interface Props {
  values: SiteCompanyFormValues;
  errors: SiteCompanyErrors;
  disabled: boolean;
  onChange: (values: SiteCompanyFormValues) => void;
  /** Opens the «Фото» library for the photo of the manager at this place. */
  onPickPhoto: (index: number) => void;
  onAddManager: () => void;
}

const grid = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
} as const;

function TwoLanguages({
  label,
  value,
  error,
  disabled,
  onChange,
}: {
  label: string;
  value: CompanyText;
  error: string | undefined;
  disabled: boolean;
  onChange: (value: CompanyText) => void;
}) {
  return (
    <Box sx={grid}>
      <TextField
        label={`${label} (укр.)`}
        value={value.uk}
        disabled={disabled}
        error={Boolean(error)}
        helperText={error}
        onChange={(event) => onChange({ ...value, uk: event.target.value })}
      />
      <TextField
        label={`${label} (рос.)`}
        value={value.ru}
        disabled={disabled}
        error={Boolean(error)}
        onChange={(event) => onChange({ ...value, ru: event.target.value })}
      />
    </Box>
  );
}

function Title({ children }: { children: string }) {
  return (
    <Typography variant="subtitle2" sx={{ mt: 1 }}>
      {children}
    </Typography>
  );
}

/** The form of «Контакти та компанія»: phones may be typed in any form, the site shows them as 050 469 86 75. */
export function SiteCompanyForm({
  values,
  errors,
  disabled,
  onChange,
  onPickPhoto,
  onAddManager,
}: Props) {
  const set = <K extends keyof SiteCompanyFormValues>(key: K, value: SiteCompanyFormValues[K]) =>
    onChange({ ...values, [key]: value });
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
    <Stack sx={{ gap: 2 }}>
      <Title>Звʼязок і адреса</Title>
      <Box sx={grid}>
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
      <TwoLanguages
        label="Місто"
        value={values.city}
        error={errors['city']}
        disabled={disabled}
        onChange={(value) => set('city', value)}
      />
      <TwoLanguages
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
      <Box sx={grid}>
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

      <Title>Менеджери на сторінці «Контакти»</Title>
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
              <TwoLanguages
                label="Імʼя"
                value={manager.name}
                error={errors[`${key}.name`]}
                disabled={disabled}
                onChange={(name) => setManager(index, { ...manager, name })}
              />
              <Box sx={grid}>
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

      <Title>Реквізити для оплати</Title>
      <TwoLanguages
        label="Отримувач"
        value={values.recipient}
        error={errors['recipient']}
        disabled={disabled}
        onChange={(value) => set('recipient', value)}
      />
      <Box sx={grid}>
        <TextField
          label="ЄДРПОУ"
          value={values.edrpou}
          disabled={disabled}
          error={Boolean(errors['edrpou'])}
          helperText={errors['edrpou']}
          onChange={(event) => set('edrpou', event.target.value)}
        />
        <TextField
          label="IBAN"
          value={values.iban}
          disabled={disabled}
          error={Boolean(errors['iban'])}
          helperText={errors['iban']}
          slotProps={{ htmlInput: { spellCheck: false } }}
          onChange={(event) => set('iban', event.target.value)}
        />
      </Box>
      <TwoLanguages
        label="Банк"
        value={values.bank}
        error={errors['bank']}
        disabled={disabled}
        onChange={(value) => set('bank', value)}
      />

      <Title>Соцмережі</Title>
      {(['instagram', 'youtube', 'facebook'] as const).map((key) => (
        <TextField
          key={key}
          label={{ instagram: 'Instagram', youtube: 'YouTube', facebook: 'Facebook' }[key]}
          value={values[key]}
          disabled={disabled}
          error={Boolean(errors[key])}
          helperText={
            errors[key] ?? 'Повна адреса профілю. Порожньо: на сайті лише назва без посилання.'
          }
          slotProps={{ htmlInput: { spellCheck: false } }}
          onChange={(event) => set(key, event.target.value)}
        />
      ))}
    </Stack>
  );
}

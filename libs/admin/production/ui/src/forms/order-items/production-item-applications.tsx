import {
  PRODUCTION_ORDER_MAX_APPLICATIONS,
  embroideryChoiceText,
  embroideryLinkLabel,
  emptyItemApplication,
  itemApplicationKindLabels,
} from '@admin/production/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import type {
  ItemApplicationFormValues,
  ItemApplicationKind,
  ItemEmbroideryLink,
  ProductionEmbroideryChoice,
} from '@admin/production/model';

/** «Розрахунок вишивки»: saved calculations found by the typed text. */
export interface EmbroideryPicker {
  options: readonly ProductionEmbroideryChoice[];
  loading: boolean;
  onSearch: (text: string) => void;
}

interface Props {
  idPrefix: string;
  applications: readonly ItemApplicationFormValues[];
  disabled: boolean;
  /** Without it a linked calculation is shown but cannot be changed. */
  embroidery?: EmbroideryPicker;
  onChange: (applications: ItemApplicationFormValues[]) => void;
}

type EmbroideryOption = ItemEmbroideryLink & { details?: string };

const toOption = (x: ProductionEmbroideryChoice): EmbroideryOption => ({
  id: x.id,
  number: x.number,
  name: x.name,
  details: [embroideryChoiceText(x), x.customerName].filter(Boolean).join(' · '),
});

/** «Нанесення» of an item: embroidery or print, where, what and in which colour. */
export function ProductionItemApplications({
  idPrefix,
  applications,
  disabled,
  embroidery,
  onChange,
}: Props) {
  const options = (embroidery?.options ?? []).map(toOption);
  const setApplication = (index: number, application: ItemApplicationFormValues) =>
    onChange(applications.map((item, i) => (i === index ? application : item)));

  return (
    <>
      {applications.map((application, index) => (
        <Stack
          key={index}
          sx={{ gap: 1.5, p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">Нанесення {index + 1}</Typography>
            <Tooltip title="Прибрати нанесення">
              <span>
                <IconButton
                  aria-label={`Прибрати нанесення ${index + 1}`}
                  disabled={disabled}
                  onClick={() => onChange(applications.filter((_, i) => i !== index))}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          <Box
            sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}
          >
            <TextField
              id={`${idPrefix}-application-${index}-kind`}
              select
              label="Вид"
              disabled={disabled}
              value={application.kind}
              onChange={(event) =>
                setApplication(index, {
                  ...application,
                  kind: event.target.value as ItemApplicationKind,
                  embroidery: event.target.value === 'Embroidery' ? application.embroidery : null,
                })
              }
            >
              {(Object.keys(itemApplicationKindLabels) as ItemApplicationKind[]).map((kind) => (
                <MenuItem key={kind} value={kind}>
                  {itemApplicationKindLabels[kind]}
                </MenuItem>
              ))}
            </TextField>
            {application.kind === 'Embroidery' && (
              <Autocomplete<EmbroideryOption>
                id={`${idPrefix}-application-${index}-embroidery`}
                sx={{ gridColumn: { sm: '1 / -1' } }}
                options={options}
                value={application.embroidery}
                disabled={disabled || !embroidery}
                loading={embroidery?.loading ?? false}
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={embroideryLinkLabel}
                noOptionsText="Розрахунків не знайдено"
                onInputChange={(_event, text, reason) => {
                  if (reason === 'input') embroidery?.onSearch(text);
                }}
                onChange={(_event, value) =>
                  setApplication(index, {
                    ...application,
                    embroidery: value
                      ? { id: value.id, number: value.number, name: value.name }
                      : null,
                    description: application.description || value?.name || '',
                  })
                }
                renderOption={({ key, ...props }, option) => (
                  <li key={key} {...props}>
                    <Box>
                      <Typography variant="body2">{embroideryLinkLabel(option)}</Typography>
                      {option.details && (
                        <Typography variant="caption" color="text.secondary">
                          {option.details}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Розрахунок вишивки"
                    helperText="З «Ціна вишивки»: цех побачить стібки, пʼяльця, матеріали й макет"
                  />
                )}
              />
            )}
            <TextField
              id={`${idPrefix}-application-${index}-place`}
              label="Місце"
              disabled={disabled}
              value={application.place}
              onChange={(event) =>
                setApplication(index, { ...application, place: event.target.value })
              }
            />
            <TextField
              id={`${idPrefix}-application-${index}-description`}
              label="Опис або текст"
              disabled={disabled}
              value={application.description}
              onChange={(event) =>
                setApplication(index, { ...application, description: event.target.value })
              }
            />
            <TextField
              id={`${idPrefix}-application-${index}-color`}
              label="Колір нанесення"
              disabled={disabled}
              value={application.color}
              onChange={(event) =>
                setApplication(index, { ...application, color: event.target.value })
              }
            />
          </Box>
        </Stack>
      ))}
      {applications.length < PRODUCTION_ORDER_MAX_APPLICATIONS && (
        <Box>
          <Button
            size="small"
            startIcon={<AddOutlinedIcon />}
            disabled={disabled}
            onClick={() => onChange([...applications, emptyItemApplication()])}
          >
            Нанесення
          </Button>
        </Box>
      )}
    </>
  );
}

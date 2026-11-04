import {
  PRODUCTION_ORDER_MAX_APPLICATIONS,
  emptyItemApplication,
  itemApplicationKindLabels,
} from '@admin/production/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import type { ItemApplicationFormValues, ItemApplicationKind } from '@admin/production/model';

interface Props {
  idPrefix: string;
  applications: readonly ItemApplicationFormValues[];
  disabled: boolean;
  onChange: (applications: ItemApplicationFormValues[]) => void;
}

/** «Нанесення» of an item: embroidery or print, where, what and in which colour. */
export function ProductionItemApplications({ idPrefix, applications, disabled, onChange }: Props) {
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
                })
              }
            >
              {(Object.keys(itemApplicationKindLabels) as ItemApplicationKind[]).map((kind) => (
                <MenuItem key={kind} value={kind}>
                  {itemApplicationKindLabels[kind]}
                </MenuItem>
              ))}
            </TextField>
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

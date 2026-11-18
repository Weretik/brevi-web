import { PRODUCTION_ORDER_MAX_ADDITIONAL_COLORS } from '@admin/production/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';

import { ProductionColorField } from '../colors/production-color-field';

import type { ProductionItemFormValues } from '@admin/production/model';

interface Props {
  idPrefix: string;
  values: ProductionItemFormValues;
  /** The error of the main colour. */
  error?: string;
  /** Active colours of «Кольори». */
  colors: readonly string[];
  disabled: boolean;
  onChange: (values: ProductionItemFormValues) => void;
}

/** The main colour and up to the allowed number of additional colours of an item. */
export function ProductionItemColors({
  idPrefix,
  values,
  error,
  colors,
  disabled,
  onChange,
}: Props) {
  const set = <K extends keyof ProductionItemFormValues>(
    key: K,
    value: ProductionItemFormValues[K],
  ) => onChange({ ...values, [key]: value });
  const setColor = (index: number, color: string) =>
    set(
      'additionalColors',
      values.additionalColors.map((item, i) => (i === index ? color : item)),
    );

  return (
    <>
      <ProductionColorField
        id={`${idPrefix}-color`}
        label="Основний колір"
        required
        disabled={disabled}
        colors={colors}
        value={values.mainColor}
        error={error}
        helperText="З довідника «Кольори»."
        onChange={(color) => set('mainColor', color)}
      />
      {values.additionalColors.map((color, index) => (
        <Stack key={index} direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <ProductionColorField
            id={`${idPrefix}-color-${index + 1}`}
            label={`Додатковий колір ${index + 1}`}
            disabled={disabled}
            colors={colors}
            value={color}
            onChange={(next) => setColor(index, next)}
          />
          <Tooltip title="Прибрати колір">
            <span>
              <IconButton
                aria-label={`Прибрати додатковий колір ${index + 1}`}
                disabled={disabled}
                onClick={() =>
                  set(
                    'additionalColors',
                    values.additionalColors.filter((_, i) => i !== index),
                  )
                }
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ))}
      {values.additionalColors.length < PRODUCTION_ORDER_MAX_ADDITIONAL_COLORS && (
        <Box>
          <Button
            size="small"
            startIcon={<AddOutlinedIcon />}
            disabled={disabled}
            onClick={() => set('additionalColors', [...values.additionalColors, ''])}
          >
            Додатковий колір
          </Button>
        </Box>
      )}
    </>
  );
}

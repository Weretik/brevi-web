import {
  compositionLineKindLabels,
  compositionMaterialText,
  compositionRest,
  compositionUnitLabels,
  fabricNormModelCaption,
  fabricNormVariants,
  forBatch,
  formatCompositionQuantity,
} from '@admin/production/model';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { FabricNormVariantCard } from './fabric-norm-variant-card';

import type { CompositionUnit, FabricNormRow, ModelComposition } from '@admin/production/model';
import type { ReactNode } from 'react';

interface Props {
  row: FabricNormRow;
  /** The model's composition from «Товари»; undefined while loading or when it is not there. */
  composition: ModelComposition | undefined;
  compositionLoading: boolean;
  compositionError: string | null;
  batchText: string;
  batchSize: number | null;
  onBatchChange: (value: string) => void;
  /** null hides «Редагувати норму» (the model is gone from «Товари»). */
  onEdit: (() => void) | null;
  /** null hides «Видалити норму». */
  onDelete: (() => void) | null;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;
const head = { bgcolor: 'action.hover', fontWeight: 600 } as const;

const quantity = (value: number, unit: CompositionUnit) =>
  formatCompositionQuantity(value, compositionUnitLabels[unit]);

/**
 * The work card of one model: fabric per item for one, two and three colours (each fabric on its
 * own line), lining, insulation and fleece, and the rest of the composition from «Товари», all
 * optionally counted for a batch.
 */
export function ModelWorkCard({
  row,
  composition,
  compositionLoading,
  compositionError,
  batchText,
  batchSize,
  onBatchChange,
  onEdit,
  onDelete,
}: Props) {
  const name = row.modelName ?? row.modelCode;
  const variants = fabricNormVariants(row);
  const batchLabel = batchSize === null ? null : `На ${batchSize} шт.`;
  const rest = composition ? compositionRest(composition) : [];
  const editHref =
    row.productId === null ? null : `/references/products/${row.productId}?tab=materials`;

  return (
    <Box
      component="section"
      aria-label={`${row.modelCode} ${name}`}
      sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={mono}>
            {fabricNormModelCaption(row)}
            {row.modelName && !row.modelIsActive ? ' · вимкнена' : ''}
          </Typography>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            label="Рахувати на"
            size="small"
            value={batchText}
            onChange={(event) => onBatchChange(event.target.value)}
            error={batchText.trim() !== '' && batchSize === null}
            sx={{ width: 140 }}
            slotProps={{
              htmlInput: { inputMode: 'numeric', 'aria-label': 'Рахувати на кількість виробів' },
              input: { endAdornment: <InputAdornment position="end">шт.</InputAdornment> },
            }}
          />
          {onDelete && (
            <Button variant="outlined" color="error" onClick={onDelete}>
              Видалити норму
            </Button>
          )}
          {onEdit && (
            <Button variant="contained" onClick={onEdit}>
              {row.norm ? 'Редагувати норму' : 'Задати норму'}
            </Button>
          )}
        </Box>
      </Box>

      {row.problem && <Alert severity="error">{row.problem}</Alert>}

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          alignItems: 'stretch',
        }}
      >
        {variants.map((variant) => (
          <FabricNormVariantCard
            key={variant.key}
            variant={variant}
            batchSize={batchSize}
            onAdd={onEdit}
          />
        ))}
      </Box>

      {compositionError ? (
        <Alert severity="error">{compositionError}</Alert>
      ) : compositionLoading && !composition ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={28} aria-label="Завантаження складу моделі" />
        </Box>
      ) : !composition ? (
        <Alert severity="warning">Складу цієї моделі в «Товари» немає.</Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
            alignItems: 'start',
          }}
        >
          <CompositionCard
            title={`Решта складу · ${rest.length}`}
            action={
              editHref && (
                <Button component={RouterLink} to={editHref} size="small">
                  Склад у «Товари»
                </Button>
              )
            }
          >
            {rest.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 2 }}>
                У «Товари» склад ще не задано.
              </Typography>
            ) : (
              <Table size="small" aria-label={`Решта складу: ${name}`}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...head, width: 100 }}>Вид</TableCell>
                    <TableCell sx={head}>Матеріал</TableCell>
                    <TableCell sx={{ ...head, width: 100 }} align="right">
                      На виріб
                    </TableCell>
                    {batchLabel && (
                      <TableCell sx={{ ...head, width: 110 }} align="right">
                        {batchLabel}
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rest.map((line, index) => (
                    <TableRow key={`${line.kind}-${line.code ?? ''}-${index}`}>
                      <TableCell>{compositionLineKindLabels[line.kind]}</TableCell>
                      <TableCell>
                        {compositionMaterialText(line)}
                        {line.article && (
                          <Typography variant="caption" color="text.secondary" component="div">
                            Артикул {line.article}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={mono}>
                        {quantity(line.quantity, line.unit)}
                      </TableCell>
                      {batchSize !== null && (
                        <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
                          {quantity(forBatch(line.quantity, batchSize), line.unit)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CompositionCard>
          <CompositionCard title="Підкладка, утеплювач, фліс" action={null}>
            {composition.layers.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 2 }}>
                Немає: модель без підкладки та утеплення.
              </Typography>
            ) : (
              <Table size="small" aria-label={`Підкладка і утеплювач: ${name}`}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={head}>Матеріал</TableCell>
                    <TableCell sx={{ ...head, width: 110 }} align="right">
                      На виріб
                    </TableCell>
                    {batchLabel && (
                      <TableCell sx={{ ...head, width: 120 }} align="right">
                        {batchLabel}
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {composition.layers.map((layer, index) => (
                    <TableRow key={`${layer.code ?? ''}-${index}`}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {layer.purpose}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {compositionMaterialText(layer)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={mono}>
                        {quantity(layer.quantity, layer.unit)}
                      </TableCell>
                      {batchSize !== null && (
                        <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
                          {quantity(forBatch(layer.quantity, batchSize), layer.unit)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CompositionCard>
        </Box>
      )}
    </Box>
  );
}

function CompositionCard({
  title,
  action,
  children,
}: {
  title: string;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', minWidth: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.25,
        }}
      >
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        {action}
      </Box>
      <TableContainer>{children}</TableContainer>
    </Paper>
  );
}

import {
  compositionLineKindLabels,
  compositionMaterialText,
  compositionUnitLabels,
  fabricNormModelCaption,
  formatCompositionQuantity,
} from '@admin/production/model';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import type { ModelComposition } from '@admin/production/model';

interface Props {
  model: ModelComposition;
  /** The «Комплектація» tab of the model card; null when the model is not in «Товари». */
  editHref: string | null;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;
const head = { bgcolor: 'action.hover', fontWeight: 600 } as const;

/**
 * One model of «Комплектація моделей», as the old «Цех» showed it: lining, insulation and fleece
 * with their norms, then the full composition from «Товари» folded under «Повна комплектація».
 */
export function ModelCompositionBlock({ model, editHref }: Props) {
  const title = `${model.modelCode} ${model.modelName}`;
  return (
    <Paper component="section" variant="outlined" aria-label={title} sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          px: 2,
          py: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" component="h3">
            {model.modelName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {fabricNormModelCaption(model)}
            {model.modelIsActive ? '' : ' · вимкнена'}
          </Typography>
        </Box>
        {editHref && (
          <Button
            variant="outlined"
            size="small"
            component={RouterLink}
            to={editHref}
            aria-label={`Змінити комплектацію: ${title}`}
          >
            Змінити комплектацію
          </Button>
        )}
      </Box>
      <TableContainer>
        <Table size="small" aria-label={`Додаткові шари: ${title}`}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...head, width: '28%' }}>Призначення</TableCell>
              <TableCell sx={head}>Матеріал</TableCell>
              <TableCell sx={{ ...head, width: 120 }} align="right">
                Норма
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {model.layers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ color: 'text.secondary' }}>
                  Підкладки, утеплювача і флісу в комплектації немає.
                </TableCell>
              </TableRow>
            ) : (
              model.layers.map((layer, index) => (
                <TableRow key={`${layer.code ?? ''}-${index}`}>
                  <TableCell>{layer.purpose}</TableCell>
                  <TableCell>{compositionMaterialText(layer)}</TableCell>
                  <TableCell align="right" sx={mono}>
                    {formatCompositionQuantity(layer.quantity, compositionUnitLabels[layer.unit])}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Accordion
        disableGutters
        elevation={0}
        square
        slotProps={{ transition: { unmountOnExit: true } }}
        sx={{ borderTop: 1, borderColor: 'divider', '&::before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
          <Typography variant="body2">
            Повна комплектація · {model.lines.length} {rowsWord(model.lines.length)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {model.lines.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 2 }}>
              У «Товари» комплектацію ще не задано.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small" aria-label={`Повна комплектація: ${title}`}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...head, width: 120 }}>Вид</TableCell>
                    <TableCell sx={{ ...head, width: 100 }}>Артикул</TableCell>
                    <TableCell sx={head}>Матеріал</TableCell>
                    <TableCell sx={{ ...head, width: 120 }} align="right">
                      Норма
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {model.lines.map((line, index) => (
                    <TableRow key={`${line.kind}-${line.code ?? ''}-${index}`}>
                      <TableCell>{compositionLineKindLabels[line.kind]}</TableCell>
                      <TableCell sx={mono}>{line.article ?? 'Усі'}</TableCell>
                      <TableCell>
                        {compositionMaterialText(line)}
                        {line.comment && (
                          <Typography variant="caption" color="text.secondary" component="div">
                            {line.comment}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={mono}>
                        {formatCompositionQuantity(line.quantity, compositionUnitLabels[line.unit])}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}

/** «1 рядок», «3 рядки», «10 рядків». */
function rowsWord(count: number) {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return 'рядків';
  if (ones === 1) return 'рядок';
  if (ones >= 2 && ones <= 4) return 'рядки';
  return 'рядків';
}

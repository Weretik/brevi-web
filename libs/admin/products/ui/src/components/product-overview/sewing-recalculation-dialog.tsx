import { sewingBlockerReasons } from '@admin/products/model';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { sewingPriceFormat } from '../sewing-pricing/sewing-price-format';

import type { SewingRecalculationReport } from '@admin/products/model';

interface Props {
  /** The dry-run report; null closes the dialog. */
  report: SewingRecalculationReport | null;
  /** «Перерахувати всі» or one model. */
  scope: 'all' | 'model';
  applying: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const shownChanges = 50;
const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Preview of «Перерахувати всі»: what changes and by how much, then publish on confirm. */
export function SewingRecalculationDialog({
  report,
  scope,
  applying,
  error,
  onClose,
  onConfirm,
}: Props) {
  const changes = report?.changes ?? [];
  const models = new Set(changes.map((change) => change.productId)).size;
  const blockedModels = new Set(report?.blocked.map((line) => line.productId)).size;
  const reasons = sewingBlockerReasons(
    (report?.blocked ?? []).flatMap((line) => line.blockers.map((code) => ({ code }))),
  );

  return (
    <Dialog
      open={Boolean(report)}
      onClose={applying ? undefined : onClose}
      aria-labelledby="sewing-recalculation-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="sewing-recalculation-title">
        {scope === 'all' ? 'Перерахувати всі ціни швейки' : 'Перерахувати ціни моделі'}
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography>
            {changes.length
              ? `Буде опубліковано ${changes.length} нових цін у ${models} моделях. Без змін: ${report?.unchanged ?? 0}.`
              : `Усі ціни актуальні, перераховувати нічого. Без змін: ${report?.unchanged ?? 0}.`}
          </Typography>
          {changes.length > 0 && (
            <Box
              sx={{
                maxHeight: 360,
                overflow: 'auto',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Table size="small" stickyHeader aria-label="Зміни цін">
                <TableHead>
                  <TableRow>
                    <TableCell>Модель</TableCell>
                    <TableCell>Артикул</TableCell>
                    <TableCell align="right">Було, 1–9 шт.</TableCell>
                    <TableCell align="right">Стане, 1–9 шт.</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {changes.slice(0, shownChanges).map((change) => (
                    <TableRow key={change.articleId}>
                      <TableCell sx={mono}>{change.modelCode ?? change.productId}</TableCell>
                      <TableCell sx={mono}>{change.saleSku}</TableCell>
                      <TableCell align="right" sx={mono}>
                        {change.before ? sewingPriceFormat(change.before.retail) : 'немає'}
                      </TableCell>
                      <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
                        {sewingPriceFormat(change.after.retail)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
          {changes.length > shownChanges && (
            <Typography variant="body2" color="text.secondary">
              І ще {changes.length - shownChanges} артикулів.
            </Typography>
          )}
          {report && report.blocked.length > 0 && (
            <Alert severity="warning">
              Не розраховано {report.blocked.length} артикулів у {blockedModels} моделях
              {reasons.length ? `: ${reasons.join(', ')}` : ''}. Їхні ціни не зміняться.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={applying} onClick={onClose}>
          Скасувати
        </Button>
        <Button variant="contained" disabled={applying || !changes.length} onClick={onConfirm}>
          {applying ? 'Публікуємо…' : 'Перерахувати і опублікувати'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

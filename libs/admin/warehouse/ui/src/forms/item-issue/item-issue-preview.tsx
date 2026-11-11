import { formatDay, formatMeters } from '@admin/warehouse/model';
import {
  Alert,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { ItemIssuePreview } from '@admin/warehouse/model';

interface Props {
  preview: ItemIssuePreview;
  issuedOn: string;
}

const signed = (value: number) => `${value > 0 ? '+' : ''}${formatMeters(value)}`;

/** The check step before «Записати»: what the issue will record and what the shelf will hold after. */
export function ItemIssuePreviewPanel({ preview, issuedOn }: Props) {
  const negative = preview.pairs.filter((x) => x.after < 0);
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="body2">
        {formatDay(issuedOn)}: {preview.issuedQuantity} шт., фактично {formatMeters(preview.meters)}
        , на виріб {preview.perProduct.toLocaleString('uk-UA')} м.
      </Typography>
      {preview.parts.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="План і факт">
            <TableHead>
              <TableRow>
                <TableCell>Плановий колір</TableCell>
                <TableCell align="right">План на {preview.issuedQuantity} шт.</TableCell>
                <TableCell align="right">Факт</TableCell>
                <TableCell align="right">Різниця</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {preview.parts.map((part) => (
                <TableRow key={part.key}>
                  <TableCell>
                    {part.fabricCode} · {part.color}
                  </TableCell>
                  <TableCell align="right">{formatMeters(part.plan)}</TableCell>
                  <TableCell align="right">{formatMeters(part.actual)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: part.difference > 0 ? 'error.main' : undefined }}
                  >
                    {signed(part.difference)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Залишки до і після">
          <TableHead>
            <TableRow>
              <TableCell>Тканина й колір на складі</TableCell>
              <TableCell align="right">Зараз</TableCell>
              <TableCell align="right">Після видачі</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preview.pairs.map((pair) => (
              <TableRow key={pair.key}>
                <TableCell>
                  {pair.fabricCode} · {pair.color}
                </TableCell>
                <TableCell align="right">{formatMeters(pair.before)}</TableCell>
                <TableCell align="right" sx={{ color: pair.after < 0 ? 'error.main' : undefined }}>
                  {formatMeters(pair.after)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {negative.length > 0 && (
        <Alert severity="warning">
          Після видачі залишок стане відʼємним: {negative.map((x) => x.color).join(', ')}. Видачу
          все одно буде записано.
        </Alert>
      )}
    </Stack>
  );
}

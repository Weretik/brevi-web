import {
  fabricIssuePurposeLabels,
  fabricLayerLabels,
  fabricLayers,
  formatMeters,
  issueLinePair,
  issueLinePart,
  issueLinePurpose,
  planPartKey,
} from '@admin/warehouse/model';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Chip, IconButton, MenuItem, Paper, Stack, TextField, Tooltip } from '@mui/material';

import { ItemIssuePairFields } from './item-issue-pair-fields';

import type {
  FabricLayer,
  FabricStockFabric,
  ItemFabric,
  ItemIssueErrors,
  ItemIssueLineValues,
} from '@admin/warehouse/model';

const ABOVE_PLAN = '';

interface Props {
  line: ItemIssueLineValues;
  index: number;
  errors: ItemIssueErrors['line'][string];
  card: ItemFabric;
  fabrics: readonly FabricStockFabric[];
  disabled: boolean;
  /** More than one line: this one may be removed. */
  canRemove: boolean;
  onChange: (patch: Partial<ItemIssueLineValues>) => void;
  onChoosePart: (partKey: string) => void;
  onRemove: () => void;
}

/** One line of «Видача»: which plan part it covers (or above plan), the pair, metres and a note. */
export function ItemIssueLine({
  line,
  index,
  errors: own,
  card,
  fabrics,
  disabled,
  canRemove,
  onChange,
  onChoosePart,
  onRemove,
}: Props) {
  const pair = issueLinePair(line, fabrics);
  const part = issueLinePart(line, card);
  const purpose = issueLinePurpose(part, pair);
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack sx={{ gap: 1.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            select
            label={`Рядок ${index + 1}: що покриває`}
            value={line.partKey ?? ABOVE_PLAN}
            disabled={disabled}
            sx={{ flex: 2 }}
            onChange={(event) => onChoosePart(event.target.value)}
          >
            {card.plan.map((x) => (
              <MenuItem key={planPartKey(x)} value={planPartKey(x)}>
                План: {x.fabricCode} · {x.color} (ще {formatMeters(x.missing)})
              </MenuItem>
            ))}
            <MenuItem value={ABOVE_PLAN}>Понад план (додаткова)</MenuItem>
          </TextField>
          {!part && (
            <TextField
              select
              label="Роль"
              value={line.layer ?? ''}
              disabled={disabled}
              sx={{ flex: 1 }}
              onChange={(event) =>
                onChange({
                  layer: (event.target.value || null) as FabricLayer | null,
                })
              }
            >
              <MenuItem value="">Не вказано</MenuItem>
              {fabricLayers.map((layer) => (
                <MenuItem key={layer} value={layer}>
                  {fabricLayerLabels[layer]}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Chip
            size="small"
            label={fabricIssuePurposeLabels[purpose]}
            color={purpose === 'Replacement' ? 'warning' : 'default'}
            sx={{ mt: 2 }}
          />
          <Tooltip title="Прибрати рядок">
            <span>
              <IconButton
                aria-label={`Прибрати рядок ${index + 1}`}
                disabled={disabled || !canRemove}
                onClick={onRemove}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <ItemIssuePairFields
          line={line}
          errors={own}
          fabrics={fabrics}
          disabled={disabled}
          onChange={onChange}
        />
        <TextField
          label="Примітка рядка"
          size="small"
          value={line.note}
          error={Boolean(own.note)}
          helperText={own.note}
          disabled={disabled}
          onChange={(event) => onChange({ note: event.target.value })}
        />
      </Stack>
    </Paper>
  );
}

import { ReferenceEditorDrawer } from '@admin/references/ui';
import { useGetFabricMovementsQuery } from '@admin/warehouse/data-access';
import { defaultFabricMovementQuery } from '@admin/warehouse/model';
import { FabricStockPairDetails } from '@admin/warehouse/ui';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { fabricMovementsPath } from '../../warehouse-paths';

import type { FabricStockPair } from '@admin/warehouse/model';

interface Props {
  pair: FabricStockPair;
  /** «Уточнити залишок» and «Прихід» for people who may move stock. */
  canMove: boolean;
  onClose: () => void;
  onAdjust: (pair: FabricStockPair) => void;
  onReceive: () => void;
}

/** How many movements the panel shows; the rest is in «Рух тканини». */
const RECENT = 5;

/** «Залишок пари»: figures, the tasks that book it and its latest movements; the table stays in place. */
export function FabricStockPairDrawer({ pair, canMove, onClose, onAdjust, onReceive }: Props) {
  const navigate = useNavigate();
  const movements = useGetFabricMovementsQuery({
    ...defaultFabricMovementQuery,
    fabricCode: pair.fabric.fabricCode,
    color: pair.color.color,
  });
  const { fabric, color } = pair;
  const details = [fabric.codes.join(' = '), fabric.composition, fabric.density]
    .filter(Boolean)
    .join(' · ');
  return (
    <ReferenceEditorDrawer
      titleId="fabric-stock-pair-title"
      title={`${fabric.fabricName} · ${color.color}`}
      description={details}
      formId="fabric-stock-pair"
      paperWidth={560}
      readOnly
      saving={false}
      editLabel={canMove ? 'Прихід' : null}
      readActions={
        canMove ? (
          <Button variant="outlined" onClick={() => onAdjust(pair)}>
            Уточнити залишок
          </Button>
        ) : null
      }
      onClose={onClose}
      onEdit={onReceive}
      onSubmit={() => undefined}
    >
      <FabricStockPairDetails
        pair={pair}
        movements={movements.data ? movements.data.rows.slice(0, RECENT) : null}
        movementsError={Boolean(movements.error)}
        onAllHistory={() =>
          navigate(
            `${fabricMovementsPath}?search=${encodeURIComponent(`${fabric.fabricCode} ${color.color}`)}`,
          )
        }
      />
    </ReferenceEditorDrawer>
  );
}

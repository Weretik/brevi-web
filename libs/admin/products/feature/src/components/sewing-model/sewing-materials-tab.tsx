import { sewingMaterialLines } from '@admin/products/model';
import { SewingLineDeleteDialog, SewingMaterialsTable } from '@admin/products/ui';
import AddIcon from '@mui/icons-material/Add';
import { Button, Stack } from '@mui/material';

import { SewingMaterialDrawer } from './sewing-material-drawer';
import { SewingModelState } from './sewing-model-state';
import { useSewingLinePanel } from '../../hooks/sewing-model/use-sewing-line-panel';

import type { SewingModel } from '../../hooks/sewing-model/use-sewing-model';
import type { SewingModelWrites } from '../../hooks/sewing-model/use-sewing-model-writes';

interface Props {
  model: SewingModel;
  writes: SewingModelWrites;
}

/** «Комплектація»: accessories and other costs shared by every fabric; changes save at once. */
export function SewingMaterialsTab({ model, writes }: Props) {
  const lines = useSewingLinePanel<string>();
  const state = <SewingModelState model={model} label="Завантаження комплектації" />;
  if (model.error || !model.draft) return state;
  const materials = model.draft.modelMaterials;
  const rows = sewingMaterialLines(model.materials);
  const open = lines.panel;
  const material =
    open && open.key !== 'new'
      ? (materials.find((item) => item.clientId === open.key) ?? null)
      : null;
  const deleting = rows.find((row) => row.key === lines.deleting) ?? null;

  return (
    <Stack sx={{ gap: 2 }}>
      {model.canManage && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              writes.clearError();
              lines.add();
            }}
          >
            Додати матеріал
          </Button>
        </Stack>
      )}
      <SewingMaterialsTable
        lines={rows}
        canManage={model.canManage}
        busy={writes.busy}
        onOpen={(key) => {
          writes.clearError();
          lines.view(key);
        }}
        onEdit={(key) => {
          writes.clearError();
          lines.edit(key);
        }}
        onDelete={(key) => {
          writes.clearError();
          lines.askDelete(key);
        }}
      />
      {open && (open.key === 'new' || material) && (
        <SewingMaterialDrawer
          key={`${open.key}:${open.readOnly}`}
          material={material}
          materials={materials}
          readOnly={open.readOnly || !model.canManage}
          saving={writes.busy}
          error={writes.error}
          onEdit={() => material && model.canManage && lines.edit(material.clientId)}
          onClose={lines.close}
          onSave={writes.saveMaterials}
        />
      )}
      <SewingLineDeleteDialog
        name={deleting?.name ?? null}
        deleting={writes.busy}
        error={writes.error}
        onClose={lines.cancelDelete}
        onConfirm={() => {
          if (!deleting) return;
          void writes
            .saveMaterials(materials.filter((item) => item.clientId !== deleting.key))
            .then((done) => done && lines.cancelDelete());
        }}
      />
    </Stack>
  );
}

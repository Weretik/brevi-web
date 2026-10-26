import { Button, Stack, Typography } from '@mui/material';

import { SewingMaterialRow } from './sewing-material-row';

import type { ProductLookups } from '../../product-editor/core/product-lookups';
import type { SewingMaterialDraft } from '@admin/products/model';

interface Props {
  scope: 'Model' | 'Article';
  materials: SewingMaterialDraft[];
  lookups: Pick<ProductLookups, 'fabrics' | 'accessories'>;
  readonly: boolean;
  canManage: boolean;
  saving: boolean;
  materialError: (index: number, field: string) => string | undefined;
  updateMaterial: (index: number, update: Partial<SewingMaterialDraft>) => void;
  onMaterialsChange: (items: SewingMaterialDraft[]) => void;
  addMaterial: () => void;
}
export function SewingMaterialSection({
  scope,
  materials,
  lookups,
  readonly,
  canManage,
  saving,
  materialError,
  updateMaterial,
  onMaterialsChange,
  addMaterial,
}: Props) {
  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="subtitle1" component="h3">
        Матеріали · {scope === 'Model' ? 'спільні' : 'артикулу'}
      </Typography>
      {materials.length === 0 && (
        <Typography color="text.secondary">Матеріалів поки немає.</Typography>
      )}
      {materials.map((material, index) => (
        <SewingMaterialRow
          key={material.clientId}
          scope={scope}
          material={material}
          error={(field) => materialError(index, field)}
          lookups={lookups}
          readonly={readonly}
          canManage={canManage}
          saving={saving}
          onChange={(update) => updateMaterial(index, update)}
          onRemove={() =>
            onMaterialsChange(
              materials
                .filter((_, position) => position !== index)
                .map((item, position) => ({ ...item, sortOrder: position })),
            )
          }
        />
      ))}
      {canManage && (
        <Button onClick={addMaterial} disabled={saving}>
          Додати матеріал
        </Button>
      )}
    </Stack>
  );
}

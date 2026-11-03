import { translateCompositionBlockers } from '@admin/products/model';
import { SewingCompositionEditor } from '@admin/products/ui';
import { TextField } from '@mui/material';

import type { SewingCompositionDraft, SewingCompositionView } from '@admin/products/model';
import type { ComponentProps } from 'react';

type EditorProps = ComponentProps<typeof SewingCompositionEditor>;

interface Props {
  scope: 'Model' | 'Article';
  modelDraft: SewingCompositionDraft | null;
  modelDirty: boolean;
  articleId: number | null;
  articleDraft: SewingCompositionDraft | null;
  articleDirty: boolean;
  articleSku?: string;
  composition?: SewingCompositionView;
  selectedDraft: SewingCompositionDraft | null;
  lookups: EditorProps['lookups'];
  canManage: boolean;
  saving: boolean;
  errors?: Record<string, string>;
  error?: string;
  onModelCodeChange: (value: string) => void;
  onModelMaterialsChange: EditorProps['onMaterialsChange'];
  onModelOperationsChange: EditorProps['onOperationsChange'];
  onArticleMaterialsChange: EditorProps['onMaterialsChange'];
  onSaveModel: () => void;
  onSaveArticle: () => void;
  onCancelModel: () => void;
  onCancelArticle: () => void;
  sections?: EditorProps['sections'];
}

export function CompositionScopeEditors(props: Props) {
  const blockers = translateCompositionBlockers(props.composition?.blockers ?? []);
  const sections = props.sections ?? 'all';
  if (props.scope === 'Model' && props.modelDraft) {
    return (
      <>
        {sections === 'all' && (
          <TextField
            label="Код моделі"
            value={props.modelDraft.modelCode ?? ''}
            onChange={(event) => props.onModelCodeChange(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 80 } }}
            disabled={!props.canManage || props.saving}
          />
        )}
        <SewingCompositionEditor
          sections={sections}
          scope="Model"
          version={props.modelDraft.version}
          materials={props.modelDraft.modelMaterials}
          operations={props.modelDraft.operations}
          lookups={props.lookups}
          canManage={props.canManage}
          dirty={props.modelDirty}
          saving={props.saving}
          errors={props.errors}
          blockers={blockers}
          error={props.error}
          onMaterialsChange={props.onModelMaterialsChange}
          onOperationsChange={props.onModelOperationsChange}
          onSave={props.onSaveModel}
          onCancel={props.onCancelModel}
        />
      </>
    );
  }

  if (
    props.scope !== 'Article' ||
    props.articleId === null ||
    !props.composition ||
    !props.selectedDraft
  ) {
    return null;
  }
  const viewMatches = props.composition.articleId === props.articleId;
  return (
    <>
      <SewingCompositionEditor
        sections={sections}
        scope="Model"
        version={props.selectedDraft.version}
        materials={viewMatches ? props.selectedDraft.modelMaterials : []}
        operations={viewMatches ? props.selectedDraft.operations : []}
        lookups={props.lookups}
        canManage={false}
        dirty={false}
        blockers={blockers}
        onMaterialsChange={() => undefined}
        onOperationsChange={() => undefined}
        onSave={() => undefined}
        onCancel={() => undefined}
      />
      {props.articleDraft && (
        <SewingCompositionEditor
          sections={sections}
          scope="Article"
          articleSku={props.articleSku}
          version={props.articleDraft.version}
          materials={props.articleDraft.articleMaterials}
          operations={[]}
          lookups={props.lookups}
          canManage={props.canManage}
          dirty={props.articleDirty}
          saving={props.saving}
          errors={props.errors}
          error={props.error}
          onMaterialsChange={props.onArticleMaterialsChange}
          onOperationsChange={() => undefined}
          onSave={props.onSaveArticle}
          onCancel={props.onCancelArticle}
        />
      )}
    </>
  );
}

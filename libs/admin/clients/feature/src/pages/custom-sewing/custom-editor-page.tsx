import { useParams } from 'react-router-dom';

import { CustomEditorScreen } from '../../components/custom-sewing/editor/custom-editor-screen';

export default function CustomEditorPage() {
  const { draftId } = useParams<{ draftId: string }>();
  return <CustomEditorScreen key={draftId ?? 'new'} draftId={draftId} />;
}

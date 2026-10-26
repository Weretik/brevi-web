import { SewingCompositionScreen } from './sewing-composition-screen';
import { useSewingCompositionController } from '../../hooks/sewing-composition/use-sewing-composition-controller';

interface Props {
  productId: number;
  onDirtyChange?: (dirty: boolean) => void;
}

export function SewingCompositionFeature({ productId, onDirtyChange }: Props) {
  const controller = useSewingCompositionController(productId, onDirtyChange);
  return <SewingCompositionScreen productId={productId} controller={controller} />;
}

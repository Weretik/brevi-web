import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { SewingCreateDraftWizard } from '../../components/sewing-create/sewing-create-draft-wizard';
import { SewingCreateNewModel } from '../../components/sewing-create/sewing-create-new-model';
import { useSewingCreateRoute } from '../../hooks/sewing-create/use-sewing-create-route';

const listHref = '/references/products';

/**
 * «Нова модель» (CAT-009, concept A): five steps from the client's sheet instruction. Step 1 saves
 * an inactive draft, so `?id=&step=` lets the user leave and continue later.
 */
export function SewingCreatePage() {
  const navigate = useNavigate();
  const route = useSewingCreateRoute();
  const exit = () => navigate(listHref);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 3.5 }, maxWidth: 1440 }}>
      {route.productId === null ? (
        <SewingCreateNewModel listHref={listHref} onCreated={route.openDraft} onExit={exit} />
      ) : (
        <SewingCreateDraftWizard
          key={route.productId}
          productId={route.productId}
          step={route.step}
          listHref={listHref}
          onStep={route.goTo}
          onExit={exit}
          onLaunched={() => navigate(`/references/products/${route.productId}`)}
        />
      )}
    </Box>
  );
}

export default SewingCreatePage;

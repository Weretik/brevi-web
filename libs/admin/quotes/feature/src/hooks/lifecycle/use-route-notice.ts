import { useLocation, useNavigate } from 'react-router-dom';

/** A one-time notice passed with navigation, for example after «Копіювати». */
export function useRouteNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const notice = (location.state as { notice?: string } | null)?.notice ?? null;
  return {
    notice,
    dismiss: () => navigate(location.pathname + location.search, { replace: true, state: null }),
  };
}

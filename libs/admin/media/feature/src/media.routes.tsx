import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MediaLibraryPage = lazy(() => import('./pages/library/media-library-page'));

export const mediaRoutes = [
  { path: '/media', element: <MediaLibraryPage /> },
  // The library used to live under «Довідники»; old bookmarks still open it.
  { path: '/references/media', element: <Navigate to="/media" replace /> },
] as const;

import { configureApiEnvironment } from '@admin/util/api-url';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/app';
import { environment } from './environments/environment';
import './styles.css';

configureApiEnvironment(environment);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

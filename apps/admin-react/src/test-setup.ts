import '@testing-library/jest-dom/vitest';

import { configureAppConfig } from '@admin/shared/config';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });

afterEach(() => {
  cleanup();
});

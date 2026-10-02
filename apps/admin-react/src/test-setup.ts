import '@testing-library/jest-dom/vitest';

import { configureApiEnvironment } from '@admin/shared/config';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

configureApiEnvironment({ production: true, api: { baseUrl: 'http://localhost' } });

afterEach(() => {
  cleanup();
});

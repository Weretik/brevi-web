import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount after each test: an open menu left mounted keeps scheduling React work after jsdom is torn down.
afterEach(cleanup);

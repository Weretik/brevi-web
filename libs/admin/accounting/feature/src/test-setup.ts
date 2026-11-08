import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// The pages use today until /api/accounting/settings answers; the stub answers 2026-11-05, so the clock says the same
// and the first requests do not depend on the day the tests run. Only Date is faked; timers stay real.
vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-05T10:00:00Z') });

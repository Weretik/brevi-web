import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { EmailTemplateAccess } from './email-template-access';

const state = vi.hoisted(() => ({
  roles: ['Admin'] as string[],
  fetching: false,
  error: undefined as unknown,
}));
vi.mock('@admin/core/auth', () => ({
  useGetAdminSessionRolesQuery: () => ({
    currentData: state.roles,
    isLoading: false,
    isFetching: state.fetching,
    error: state.error,
    refetch: vi.fn(),
  }),
}));
vi.mock('@admin/clients/feature', () => ({
  EmailTemplateSessionProvider: ({
    value,
  }: {
    value: { currentData: string[]; isFetching: boolean; error: unknown };
  }) => (
    <output>
      {JSON.stringify({
        roles: value.currentData,
        fetching: value.isFetching,
        denied: !!value.error,
      })}
    </output>
  ),
}));
afterEach(cleanup);

it('passes current app session state and access loss to the CRM permission boundary', () => {
  const view = render(
    <EmailTemplateAccess>
      <span>feature</span>
    </EmailTemplateAccess>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('"roles":["Admin"]');
  state.fetching = true;
  view.rerender(
    <EmailTemplateAccess>
      <span>feature</span>
    </EmailTemplateAccess>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('"fetching":true');
  state.roles = [];
  state.error = { status: 403 };
  view.rerender(
    <EmailTemplateAccess>
      <span>feature</span>
    </EmailTemplateAccess>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('"roles":[]');
  expect(screen.getByRole('status')).toHaveTextContent('"denied":true');
});

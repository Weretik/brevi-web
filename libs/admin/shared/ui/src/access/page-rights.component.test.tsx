import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageRightsProvider, PageRightsScope, usePageRights } from './page-rights';

import type { CanDo } from './page-rights';

function Rights() {
  const { canCreate, canEdit, canDelete } = usePageRights();
  return (
    <p>
      {[canCreate && 'create', canEdit && 'edit', canDelete && 'delete'].filter(Boolean).join(' ')}
    </p>
  );
}

// The director gave «work-log» only «Створювати» and «payroll» only «Редагувати».
const granted: Record<string, readonly string[]> = { 'work-log': ['create'], payroll: ['edit'] };
const can: CanDo = (action, page = 'work-log') => granted[page]?.includes(action) ?? false;

describe('usePageRights', () => {
  it('allows everything outside the app', () => {
    render(<Rights />);
    expect(screen.getByText('create edit delete')).toBeInTheDocument();
  });

  it('answers for the route page and, inside a scope, for the scope page', () => {
    render(
      <PageRightsProvider can={can}>
        <Rights />
        <PageRightsScope page="payroll">
          <Rights />
        </PageRightsScope>
      </PageRightsProvider>,
    );
    expect(screen.getByText('create')).toBeInTheDocument();
    expect(screen.getByText('edit')).toBeInTheDocument();
  });
});

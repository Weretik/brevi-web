import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

function TestHarness(): React.JSX.Element {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <button type="button" onClick={() => setIsConfirmed(true)}>
      {isConfirmed ? 'Підтверджено' : 'Підтвердити'}
    </button>
  );
}

describe('React test harness', () => {
  it('supports accessible user interactions and DOM assertions', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);
    await user.click(screen.getByRole('button', { name: 'Підтвердити' }));

    expect(screen.getByRole('button', { name: 'Підтверджено' })).toBeVisible();
  });
});

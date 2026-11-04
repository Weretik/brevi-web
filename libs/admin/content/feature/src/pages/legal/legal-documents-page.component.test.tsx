import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LegalDocumentsPage from './legal-documents-page';

describe('LegalDocumentsPage', () => {
  it('lists the public documents and copies a link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<LegalDocumentsPage />);

    expect(screen.getByRole('heading', { name: 'Політика конфіденційності' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /Відкрити/ })[1].getAttribute('href')).toBe(
      '/brevi-erp/privacy.html',
    );

    fireEvent.click(screen.getAllByRole('button', { name: /Копіювати посилання/ })[1]);

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/brevi-erp/privacy.html`),
    );
    expect(await screen.findByText('Посилання скопійовано.')).toBeTruthy();
  });
});

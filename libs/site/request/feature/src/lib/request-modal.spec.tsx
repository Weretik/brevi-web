import { getRequestDictionary } from '@site/request/ui';
import { fireEvent, render, screen } from '@testing-library/react';

import { RequestModal } from './request-modal';

const back = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ back }) }));
vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

describe('RequestModal', () => {
  it('opens the form at once, filled with the product', async () => {
    const dictionary = getRequestDictionary('uk');
    render(await RequestModal({ locale: 'uk', product: 'Костюм «Імпульс»' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).toContain(dictionary.form.title);
    expect((document.getElementById('request-workwear') as HTMLInputElement).value).toBe(
      'Костюм «Імпульс»',
    );
  });

  it('goes back to the page under it when closed', async () => {
    render(await RequestModal({ locale: 'ru' }));

    fireEvent.click(screen.getByRole('button', { name: getRequestDictionary('ru').close }));
    expect(back).toHaveBeenCalledOnce();
  });
});

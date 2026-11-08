import { fireEvent, render, screen } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './login-page';
import { setSessionState } from '../session/session-store';
import { requestLogin } from '../session/session-transport';

vi.mock('../session/session-transport', () => ({
  requestLogin: vi.fn(),
  requestLogout: vi.fn(),
  requestCurrentUser: vi.fn(),
}));

const loginMock = vi.mocked(requestLogin);

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={[`/login?returnTo=${encodeURIComponent('/orders/3')}`]}>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<p>Замовлення 3</p>} path="/orders/3" />
      </Routes>
    </MemoryRouter>,
  );

const fillAndSubmit = () => {
  fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'm@brevi.com.ua' } });
  fireEvent.change(screen.getByLabelText(/^Пароль/), { target: { value: 'secret-pass' } });
  fireEvent.click(screen.getByRole('button', { name: 'Увійти' }));
};

describe('LoginPage', () => {
  it('says where the user signs in and lets them see the password', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: 'Вхід у Brevi Office' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Конфіденційність' }).getAttribute('href')).toBe(
      '/brevi-erp/privacy.html',
    );

    const password = screen.getByLabelText(/^Пароль/);
    expect(password.getAttribute('type')).toBe('password');
    fireEvent.click(screen.getByRole('button', { name: 'Показати пароль' }));
    expect(password.getAttribute('type')).toBe('text');
  });

  it('warns when Caps Lock is on', () => {
    renderLogin();
    const password = screen.getByLabelText(/^Пароль/);

    fireEvent.keyUp(password, { key: 'CapsLock', modifierCapsLock: true });

    expect(screen.getByText('Увімкнено Caps Lock')).toBeTruthy();
  });

  beforeEach(() => {
    setSessionState({ status: 'anonymous' });
    loginMock.mockReset();
  });

  it('returns the manager to the page they came from', async () => {
    loginMock.mockResolvedValue({
      id: '1',
      email: 'm@brevi.com.ua',
      fullName: 'M',
      roles: ['Manager'],
      avatarUrl: null,
      access: { allowAll: false, roles: [], grants: {} },
    });
    renderLogin();
    fillAndSubmit();

    expect(await screen.findByText('Замовлення 3')).toBeTruthy();
  });

  it('explains wrong credentials', async () => {
    const response = {
      status: 401,
      data: {},
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
    loginMock.mockRejectedValue(
      new AxiosError('Unauthorized', '401', undefined, undefined, response),
    );
    renderLogin();
    fillAndSubmit();

    expect((await screen.findByRole('alert')).textContent).toContain('Невірний email або пароль');
  });
});

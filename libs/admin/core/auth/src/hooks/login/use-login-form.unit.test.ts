import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLoginForm } from './use-login-form';

import type { FormEvent } from 'react';

const navigate = vi.hoisted(() => vi.fn());
const login = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', () => ({ useNavigate: () => navigate }));
vi.mock('../../session/auth-session', () => ({ login }));

const submitEvent = { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>;

describe('useLoginForm', () => {
  it('signs in with the trimmed email and returns to the page asked for', async () => {
    login.mockResolvedValue(undefined);
    const { result } = renderHook(() => useLoginForm('/production/orders'));

    act(() => {
      result.current.setEmail(' director@brevi.com.ua ');
      result.current.setPassword('secret');
    });
    await act(() => result.current.handleSubmit(submitEvent));

    expect(login).toHaveBeenCalledWith({ email: 'director@brevi.com.ua', password: 'secret' });
    expect(navigate).toHaveBeenCalledWith('/production/orders', { replace: true });
    expect(result.current.isSubmitting).toBe(false);
  });

  it('shows an error when the sign-in fails', async () => {
    login.mockRejectedValue(new Error('401'));
    const { result } = renderHook(() => useLoginForm('/'));

    await act(() => result.current.handleSubmit(submitEvent));

    expect(result.current.error).toEqual(expect.any(String));
    expect(result.current.isSubmitting).toBe(false);
  });
});

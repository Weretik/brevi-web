import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLoginErrorMessage } from '../../pages/login-error-message';
import { login } from '../../session/auth-session';

import type { FormEvent } from 'react';

/** The sign-in form: email and password, the error shown above it, and going back to `returnPath`. */
export function useLoginForm(returnPath: string) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate(returnPath, { replace: true });
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { email, setEmail, password, setPassword, error, isSubmitting, handleSubmit };
}

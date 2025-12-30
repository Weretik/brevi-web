import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TokenProvider } from '../tokens/token.provider';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenProvider = inject(TokenProvider);
  const token = tokenProvider.getAccessToken();

  if (!token) return next(request);

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};

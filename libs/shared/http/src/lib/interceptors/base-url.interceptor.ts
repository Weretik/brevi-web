import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_BASE_URL } from '../api-url.token';

export const baseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  const baseUrl = inject(API_BASE_URL);

  if (/^https?:\/\//i.test(request.url)) {
    return next(request);
  }

  const path = request.url.startsWith('/') ? request.url : `/${request.url}`;
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');

  return next(request.clone({ url: `${normalizedBaseUrl}${path}` }));
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_URL } from '../api-url.token';

export const baseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (/^https?:\/\//i.test(request.url)) return next(request);

  const apiUrl = inject(API_URL);
  const url = `${apiUrl.replace(/\/$/, '')}/${request.url.replace(/^\//, '')}`;
  return next(request.clone({ url }));
};

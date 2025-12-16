import { HttpInterceptorFn } from '@angular/common/http';
import { AppConfig } from '@app/core/config/app-config';

export const baseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (/^https?:\/\//i.test(request.url)) return next(request);

  const url = `${AppConfig.apiBaseUrl.replace(/\/$/, '')}/${request.url.replace(/^\//, '')}`;
  return next(request.clone({ url }));
};

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSvc = inject(AuthService);

  const accessData = authSvc.getAccessData();
  if (!accessData) return next(req);

  const newReq = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${accessData.accessToken}`
    ),
  });

  return next(newReq);
};

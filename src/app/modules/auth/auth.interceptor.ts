import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const cloned = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(cloned).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401) {
        authService.logout(); // limpa o token e o estado
        router.navigate(['']); // volta para o splash
      }
      return throwError(() => erro);
    }),
  );
};

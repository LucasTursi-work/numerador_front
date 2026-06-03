import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const isPublicUrl = req.url.includes('/api/auth/login');

  let cloned = req;
  if (token && !isPublicUrl) {
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(cloned).pipe(
    catchError((erro: HttpErrorResponse) => {
      // Se for 401 e NÃO for uma rota pública
      if (erro.status === 401 && !isPublicUrl) {
        console.warn('Sessão inválida ou expirada. Redirecionando...');
        authService.logout();
        router.navigate(['']);
      }

      return throwError(() => erro);
    }),
  );
};

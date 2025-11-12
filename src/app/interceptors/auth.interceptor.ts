import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from '../services/auth';

/**
 * Interceptor que agrega automáticamente el token JWT
 * a todas las solicitudes HTTP salientes, excepto si se requiere excluir alguna ruta.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 🔸 Opcional: excluir rutas públicas (por ejemplo, login o registro)
  const isPublic = req.url.includes('/auth/login') || req.url.includes('/auth/register');
  if (isPublic) {
    return next(req);
  }

  // 🔹 Si existe token, clonamos la petición y agregamos el header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  // 🔸 Si no hay token, simplemente sigue la petición original
  return next(req);
};

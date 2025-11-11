import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    return true; // ✅ Usuario autenticado
  }

  // 🚫 No autenticado → redirigir al login
  router.navigate(['/auth/login']);
  return false;
};

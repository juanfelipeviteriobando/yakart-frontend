import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { CatalogComponent } from './app/pages/catalog/catalog';
import { CustomOrdersComponent } from './app/pages/custom-orders/custom-orders';
import { ProductComponent } from './app/pages/product/product';
import { ClientesListComponent } from './app/pages/clientes/list/list';
import { CartComponent } from './app/pages/cart/cart';
import { HomeComponent } from './app/pages/home/home';
import { authGuard } from './app/guards/auth.guard';
import { AdminProductsComponent } from './app/pages/menu-products/menu-products';
import { ContactComponent } from './app/pages/contact/contact';
import { AdminCustomOrdersComponent } from './app/pages/menu-custom-orders/menu-custom-orders';
import { AuthService } from './app/services/auth';

AdminCustomOrdersComponent
export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: HomeComponent },
      { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
      { path: 'documentation', component: Documentation, canActivate: [authGuard] },
      { path: 'clientes', component: ClientesListComponent, canActivate: [authGuard] },
      { path: 'catalog', component: CatalogComponent },
      { path: 'customorders', component: CustomOrdersComponent, canActivate: [authGuard] },
      { path: 'cart', component: CartComponent, canActivate: [authGuard] },
      { path: 'contact', component: ContactComponent },
      { path: 'product/:id', component: ProductComponent },

      // 🔸 Ruta protegida solo para administradores
      {
        path: 'menu-products',
        component: AdminProductsComponent,
        canActivate: [() => {
          const auth = inject(AuthService);
          if (auth.getUserRole() === 'admin') return true;
          alert('Acceso denegado: esta sección es solo para administradores.');
          return false;
        }],
      },
      {
        path: 'menu-custom-orders',
        component: AdminCustomOrdersComponent,
        canActivate: [() => {
          const auth = inject(AuthService);
          if (auth.getUserRole() === 'admin') return true;
          alert('Acceso denegado: esta sección es solo para administradores.');
          return false;
        }],
      },
    ],
  },
  { path: 'landing', component: Landing },
  { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' },
];

import { Routes } from '@angular/router';
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
import { Home } from './app/pages/home/home';
import { authGuard } from './app/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: Home },
      { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
      { path: 'documentation', component: Documentation, canActivate: [authGuard] },
      { path: 'clientes', component: ClientesListComponent, canActivate: [authGuard] },
      { path: 'catalog', component: CatalogComponent},
      { path: 'customorders', component: CustomOrdersComponent, canActivate: [authGuard] },
      { path: 'cart', component: CartComponent, canActivate: [authGuard] },
      { path: 'product/:id', component: ProductComponent },
    ],
  },
  { path: 'landing', component: Landing },
  { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' },
];

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
import { Home } from './app/pages/home/home';
export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Home },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'clientes', component: ClientesListComponent },
            { path: 'catalog', component: CatalogComponent },
            { path: 'customorders', component: CustomOrdersComponent },
  { path: '', component: CatalogComponent },
  { path: 'product/:id', component: ProductComponent },
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

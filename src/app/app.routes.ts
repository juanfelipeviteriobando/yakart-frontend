import { provideRouter,Routes } from '@angular/router';
import { ClientesListComponent } from './pages/clientes/list/list';
import { Home } from './pages/home/home';
import { CatalogComponent } from './pages/catalog/catalog';
import { ProductComponent } from './pages/product/product';


export const routes: Routes = [
   { path: '1', component: Home },
  { path: 'clientes', component: ClientesListComponent },
  { path: '', component: CatalogComponent },
  { path: 'product/:id', component: ProductComponent },
];

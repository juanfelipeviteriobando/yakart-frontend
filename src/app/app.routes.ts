import { Routes } from '@angular/router';
import { ListComponent } from './pages/clientes/list/list';
// importa el componente (ruta relativa)
import { ShopComponent } from './pages/shop/shop.component';


export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ListComponent },
  { path: 'yakart', component: ShopComponent },
];

import { Routes } from '@angular/router';
import { ProductsListComponent } from './pages/products/products-list.component';
import { ClientsListComponent } from './pages/clients/clients-list.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AccessoriesComponent } from './pages/accessories/accessories.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductsListComponent },
  { path: 'clientes', component: ClientsListComponent },
  { path: 'pedidos', component: OrdersComponent },
  { path: 'accesorios', component: AccessoriesComponent },
  { path: 'carrito', component: CartComponent },
  { path: '**', redirectTo: 'productos' }
];

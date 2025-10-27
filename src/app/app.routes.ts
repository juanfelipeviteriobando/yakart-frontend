import { Routes } from '@angular/router';
import { ListComponent } from './pages/clientes/list/list';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ListComponent },
];

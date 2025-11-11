import { Routes } from '@angular/router';
import { Access } from './access';
import { LoginComponent } from './login';
import { Error } from './error';
import { AppLayout } from '../../../app/layout/component/app.layout';
import { RegisterComponent } from '../../../app/pages/register/register';
export default [
    {
        path: '',
        component: AppLayout,
        children: [
             { path: 'login', component: LoginComponent },
             { path: 'register', component: RegisterComponent }
        ],
      },
    { path: 'access', component: Access },
    { path: 'error', component: Error },

] as Routes;

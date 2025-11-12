import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `
})
export class AppMenu implements OnInit {
  model: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const userRole = this.authService.getUserRole();

    this.model = [
      {
        label: 'Principal',
        items: [
          { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
          { label: 'Catálogo', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/catalog'] },
          { label: 'Pedidos personalizados', icon: 'pi pi-fw pi-box', routerLink: ['/customorders'] },
          { label: 'Carrito', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/cart'] },
          { label: 'Contacto', icon: 'pi pi-fw pi-envelope', routerLink: ['/contact'] },
        ],
      },
      {
        label: 'Clientes',
        items: [
          { label: 'Lista de clientes', icon: 'pi pi-fw pi-users', routerLink: ['/clientes'], visible: userRole === 'admin' },
        ],
      },
      {
        label: 'Administración',
        visible: userRole === 'admin',
        items: [
          { label: 'Gestión de productos', icon: 'pi pi-fw pi-box', routerLink: ['/menu-products'] },
          { label: 'Pedidos de clientes', icon: 'pi pi-fw pi-list', routerLink: ['/menu-custom-orders'] },
        ],
      },
      {
        label: 'Documentación',
        items: [
          { label: 'Ver documentación', icon: 'pi pi-fw pi-book', routerLink: ['/documentation'] },
        ],
      },
      {
        label: 'Autenticación',
        items: [
          { label: 'Iniciar sesión', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
          { label: 'Cerrar sesión', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() },
        ],
      },
    ];
  }

  logout() {
    this.authService.logout();
  }
}

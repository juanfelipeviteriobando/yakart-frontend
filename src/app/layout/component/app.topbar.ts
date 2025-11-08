import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, StyleClassModule, AppConfigurator],
  template: `
  <header class="yakart-topbar">
    <div class="yakart-topbar-inner">
      <!-- Logo -->
      <a routerLink="/" class="yakart-logo"> 
        <img src="src/assets/img/yakart-logo.png" alt="YakArt" />
      </a>

      <!-- Menú central -->
      <nav class="yakart-nav">
        <a routerLink="/" routerLinkActive="active">Página Principal</a>
        <a routerLink="/clientes" routerLinkActive="active">Catálogo</a>
        <a routerLink="/faq" routerLinkActive="active">Preguntas Frecuentes</a>
        <a routerLink="/contacto" routerLinkActive="active">Contáctanos</a>
      </nav>

      <!-- Acciones a la derecha -->
      <div class="yakart-actions">
        <!-- Botón cambiar tema -->
        <button type="button" class="icon-btn" (click)="toggleDarkMode()">
          <i [ngClass]="{
            'pi': true,
            'pi-moon': layoutService.isDarkTheme(),
            'pi-sun': !layoutService.isDarkTheme()
          }"></i>
        </button>

        <!-- Configurador de tema -->
        <div class="relative">
          <button
            class="icon-btn"
            pStyleClass="@next"
            enterFromClass="hidden"
            enterActiveClass="animate-scalein"
            leaveToClass="hidden"
            leaveActiveClass="animate-fadeout"
            [hideOnOutsideClick]="true"
          >
            <i class="pi pi-palette"></i>
          </button>
          <app-configurator />
        </div>

        <!-- Íconos adicionales -->
        <a routerLink="/buscar" class="icon-btn"><i class="pi pi-search"></i></a>
        <a routerLink="/carrito" class="icon-btn"><i class="pi pi-shopping-cart"></i></a>
        <a routerLink="/perfil" class="icon-btn"><i class="pi pi-user"></i></a>
      </div>
    </div>
  </header>
  `,
  styles: [`
    .yakart-topbar {
      width: 100%;
      background-color: #fdebea;
      border-bottom: 2px solid #ffc5ce;
      font-family: 'Inter', Arial, sans-serif;
      color: #7a2a33;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .yakart-topbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .yakart-logo img {
      height: 38px;
    }

    .yakart-nav {
      display: flex;
      gap: 2rem;
      font-weight: 500;
    }

    .yakart-nav a {
      text-decoration: none;
      color: #7a2a33;
      transition: color 0.3s;
    }

    .yakart-nav a:hover,
    .yakart-nav a.active {
      color: #c63b52;
    }

    .yakart-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-btn {
      background: none;
      border: none;
      color: #7a2a33;
      font-size: 1.2rem;
      cursor: pointer;
      transition: transform 0.2s, color 0.3s;
    }

    .icon-btn:hover {
      color: #c63b52;
      transform: scale(1.1);
    }

    /* Soporte tema oscuro */
    :host-context(.dark-theme) .yakart-topbar {
      background-color: #2a2a2a;
      color: #f9dada;
    }
    :host-context(.dark-theme) .yakart-nav a {
      color: #f9dada;
    }
    :host-context(.dark-theme) .yakart-nav a:hover {
      color: #ff8ea1;
    }
    :host-context(.dark-theme) .icon-btn {
      color: #f9dada;
    }
  `]
})
export class AppTopbar {
  constructor(public layoutService: LayoutService) {}

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme
    }));
  }
}

import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenu],
  template: `
    <div class="layout-sidebar">
      <app-menu></app-menu>
    </div>
  `,
  styles: [`
    /* Contenedor de la barra lateral */
    .layout-sidebar {
      width: 250px;
      background: linear-gradient(180deg, #ffe6f0 0%, #ffe6f0 100%); /* degradado rosa pastel */
      padding: 15px;
      border-radius: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      height: 100vh;
      overflow-y: auto;
    }

    /* Scroll suave y discreto */
    .layout-sidebar::-webkit-scrollbar {
      width: 6px;
    }
    .layout-sidebar::-webkit-scrollbar-thumb {
      background-color: rgba(102, 51, 102, 0.3); /* violeta suave */
      border-radius: 3px;
    }
    .layout-sidebar::-webkit-scrollbar-track {
      background: transparent;
    }
  `]
})
export class AppSidebar {
  constructor(public el: ElementRef) {}
}

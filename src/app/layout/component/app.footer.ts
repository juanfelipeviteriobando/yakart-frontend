import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  template: `
  <footer class="yak-footer">
    <!-- SECCIÓN INFERIOR DE ICONOS -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10 text-center">
  <div class="p-4 bg-[#ffeef0] rounded-xl shadow-sm flex flex-col items-center">
    <i class="pi pi-star text-pink-500 text-3xl mb-2"></i>
    <h3 class="text-pink-700 font-semibold">Buena Calidad</h3>
    <p class="text-sm text-gray-600">Productos seleccionados cuidadosamente</p>
  </div>
  <div class="p-4 bg-[#ffeef0] rounded-xl shadow-sm flex flex-col items-center">
    <i class="pi pi-shield text-pink-500 text-3xl mb-2"></i>
    <h3 class="text-pink-700 font-semibold">Garantía Segura</h3>
    <p class="text-sm text-gray-600">Tus compras están protegidas</p>
  </div>
  <div class="p-4 bg-[#ffeef0] rounded-xl shadow-sm flex flex-col items-center">
    <i class="pi pi-send text-pink-500 text-3xl mb-2"></i>
    <h3 class="text-pink-700 font-semibold">Envío Gratis</h3>
    <p class="text-sm text-gray-600">En compras superiores a $100</p>
  </div>
  <div class="p-4 bg-[#ffeef0] rounded-xl shadow-sm flex flex-col items-center">
    <i class="pi pi-headphones text-pink-500 text-3xl mb-2"></i>
    <h3 class="text-pink-700 font-semibold">Soporte 24/7</h3>
    <p class="text-sm text-gray-600">Atención personalizada para ti</p>
  </div>
</div>

    <div class="yak-footer-inner">
      <div class="col-brand">
        <h3 class="brand-title">YakArt.</h3>
        <p class="follow-text">sígueme en mis redes:</p>
        <div class="socials flex gap-3 items-center justify-center">
          <a href="#" aria-label="Instagram"><img src="../../../../icons/instagram.svg" alt="Instagram" class="w-5 h-5" /></a>
          <a href="#" aria-label="WhatsApp"><img src="../../../../icons/whatsapp.svg" alt="WhatsApp" class="w-5 h-5" /></a>
          <a href="#" aria-label="Facebook"><img src="../../../../icons/facebook.svg" alt="Facebook" class="w-5 h-5" /></a>
          <a href="#" aria-label="TikTok"><img src="../../../../icons/tiktok.svg" alt="TikTok" class="w-5 h-5" /></a>
        </div>
      </div>

      <div class="col-links">
        <h4>Links</h4>
        <ul>
          <li><a routerLink="/">Pagina principal</a></li>
          <li><a routerLink="/catalog">Catalogo</a></li>
          <li><a routerLink="/documentation">preguntas frecuentes</a></li>
          <li><a routerLink="/contact">contactanos</a></li>
        </ul>
      </div>

      <div class="col-help">
        <h4>Help</h4>
        <ul>
          <li><a routerLink="/payments">opciones de pago</a></li>
          <li><a routerLink="/returns">reintegros</a></li>
          <li><a routerLink="/privacy">Políticas de privacidad</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>2025. All rights reserved</span>
    </div>
  </footer>
  `,
  styles: [`
    .yak-footer {
      background-color: #fdebea;
      padding: 3rem 2rem 1rem;
      color: #7a2a33;
      font-family: 'Inter', Arial, sans-serif;
    }

    .yak-footer-inner {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 3rem;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      padding-bottom: 1.5rem;
    }

    .col-brand, .col-links, .col-help {
      flex: 1 1 200px;
    }

    .brand-title {
      margin: 0 0 0.5rem;
      font-weight: 700;
      color: #c63b52;
      font-size: 1.4rem;
    }

    .follow-text {
      margin: 0 0 0.75rem;
      font-size: 0.95rem;
    }

    .socials a img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      transition: transform 0.2s ease;
    }
    .socials a img:hover {
      transform: scale(1.1);
    }

    h4 {
      color: #c63b52;
      font-weight: 600;
      margin-bottom: 0.6rem;
      font-size: 1rem;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin: 0.4rem 0;
    }

    a {
      color: #7a2a33;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    a:hover {
      color: #c63b52;
      text-decoration: underline;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 1rem;
      font-size: 0.85rem;
      color: #a87b7b;
    }
  `]
})
export class AppFooter {}

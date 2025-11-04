import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),  // preserva los providers existentes
    provideHttpClient(),             // habilita HttpClient
    importProvidersFrom(FormsModule),// habilita FormsModule
    provideAnimationsAsync(),        // habilita animaciones de PrimeNG
    providePrimeNG({
      theme: {
        preset: Aura                // aplica el tema Aura
      }
    })
  ]
})
.catch(err => console.error(err));

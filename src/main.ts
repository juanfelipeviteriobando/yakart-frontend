import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),  // preserva los providers existentes
    provideHttpClient(),             // habilita HttpClient
    importProvidersFrom(FormsModule) // habilita FormsModule
  ]
})
.catch(err => console.error(err));

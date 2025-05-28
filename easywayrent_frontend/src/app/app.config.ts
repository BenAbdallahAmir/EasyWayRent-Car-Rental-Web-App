import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; //import the httpclient

import { routes } from './app.routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), //withFetch() bech el app tnajjem tjib data mn API
    provideNoopAnimations(),
  ],
};


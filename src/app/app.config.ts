import { provideEventPlugins } from "@taiga-ui/event-plugins";
import {
  ApplicationConfig, inject,
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import { routes } from './app.routes';

import "prismjs";
import "prismjs/components/prism-typescript.min.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/plugins/line-highlight/prism-line-highlight.min.js";
import {authTokenInterceptor} from '../utils/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEventPlugins(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor]))
  ]
};

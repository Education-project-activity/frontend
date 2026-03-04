import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import {APP_BASE_HREF} from '@angular/common';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

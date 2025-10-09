import { InjectionToken } from "@angular/core";

export interface AppSettings {
  title: string;
  version: string;
  apiUrl: string;
}

export const appSettings: AppSettings = {
  title: 'Disc Golf Database',
  version: '0.0.0',
  apiUrl: 'http://localhost:8080/api'
};

export const APP_SETTINGS = new InjectionToken<AppSettings>('app.settings');

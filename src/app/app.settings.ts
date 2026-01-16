import { InjectionToken } from "@angular/core";

export interface AppSettings {
  title: string;
  version: string;
  baseUrl: string;
  apiUrl: string;
  currentYear: number
}

export const appSettings: AppSettings = {
  title: 'Swisstour Discgolf',
  version: '0.0.0',
  baseUrl: 'http://localhost:8080',
  apiUrl: 'http://localhost:8080/api',
  currentYear: 2025
};

export const APP_SETTINGS = new InjectionToken<AppSettings>('app.settings');

import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'de' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'selectedLanguage';
  currentLanguage = signal<Language>('en');

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage(): void {
    // Try to get saved language from localStorage
    const savedLang = localStorage.getItem(this.STORAGE_KEY) as Language;

    // Get browser language
    const browserLang = this.translate.getBrowserLang() as Language;

    // Determine which language to use
    const langToUse = savedLang || (this.isSupported(browserLang) ? browserLang : 'en');

    this.setLanguage(langToUse);
  }

  setLanguage(lang: Language): void {
    if (this.isSupported(lang)) {
      this.translate.use(lang);
      this.currentLanguage.set(lang);
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  private isSupported(lang: string): lang is Language {
    return ['en', 'de', 'fr'].includes(lang);
  }

  getAvailableLanguages(): Language[] {
    return ['en', 'de', 'fr'];
  }
}

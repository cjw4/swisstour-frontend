import { Component, inject, signal } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LanguageService, Language } from '../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  settings = inject(APP_SETTINGS);
  mobileMenuOpen = signal(false);
  isStandingsOpen = false;
  isLanguageOpen = false;
  authService = inject(AuthService);
  languageService = inject(LanguageService);

  toggleStandings() {
    this.isStandingsOpen = !this.isStandingsOpen;
  }

  toggleLanguage() {
    this.isLanguageOpen = !this.isLanguageOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  changeLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
    this.isLanguageOpen = false;
  }

  get currentLanguage() {
    return this.languageService.currentLanguage();
  }
}

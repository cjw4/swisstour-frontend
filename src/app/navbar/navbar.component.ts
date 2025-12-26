import { Component, inject, signal } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  settings = inject(APP_SETTINGS);
  mobileMenuOpen = signal(false);
  isStandingsOpen = false;
  isLanguageOpen = false;
  authService = inject(AuthService);

  toggleStandings() {
    this.isStandingsOpen = !this.isStandingsOpen;
  }

  toggleLanguage() {
    this.isLanguageOpen = !this.isLanguageOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }
}

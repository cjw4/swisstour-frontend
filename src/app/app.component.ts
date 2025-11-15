import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { CopyrightDirective } from './directives/copyright.directive';
import { APP_SETTINGS, appSettings } from './app.settings';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    BannerComponent,
    LoadingIndicatorComponent,
    CopyrightDirective,
    NgOptimizedImage,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class AppComponent {
  settings = inject(APP_SETTINGS);
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }
}

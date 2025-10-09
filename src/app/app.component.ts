import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { APP_SETTINGS, appSettings } from './app.settings';
import { CopyrightDirective } from './directives/copyright.directive';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    RouterLink,
    CopyrightDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
})
export class AppComponent {
  settings = inject(APP_SETTINGS);
}

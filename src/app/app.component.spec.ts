import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventEmitter, signal } from '@angular/core';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { APP_SETTINGS, appSettings } from './app.settings';

const authServiceMock = {
  adminLoggedIn: jasmine.createSpy('adminLoggedIn').and.returnValue(false)
};

const languageServiceMock = {
  currentLanguage: signal('en'),
  setLanguage: jasmine.createSpy('setLanguage'),
  getAvailableLanguages: jasmine.createSpy('getAvailableLanguages').and.returnValue(['en', 'de', 'fr'])
};

const translateServiceMock = {
  instant: jasmine.createSpy('instant').and.returnValue(''),
  get: jasmine.createSpy('get').and.returnValue(of('')),
  stream: jasmine.createSpy('stream').and.returnValue(of('')),
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: APP_SETTINGS, useValue: appSettings }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Swisstour' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Swisstour');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventEmitter, signal } from '@angular/core';
import { of } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { APP_SETTINGS, appSettings } from '../../../app.settings';
import { AuthService } from '../../../core/auth/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

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
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: APP_SETTINGS, useValue: appSettings },
        { provide: AuthService, useValue: authServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

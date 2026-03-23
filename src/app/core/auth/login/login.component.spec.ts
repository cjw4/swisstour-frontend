import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { BannerService } from '../../services/banner.service';
import { AuthService } from '../auth.service';
import { LoadingService } from '../../services/loading.service';
import { TranslateService } from '@ngx-translate/core';

const bannerServiceMock = {
  updateBanner: jasmine.createSpy('updateBanner')
};

const authServiceMock = {
  login: jasmine.createSpy('login').and.returnValue(of(''))
};

const loadingServiceMock = {
  loadingOn: jasmine.createSpy('loadingOn'),
  loadingOff: jasmine.createSpy('loadingOff')
};

const translateServiceMock = {
  instant: jasmine.createSpy('instant').and.returnValue(''),
  get: jasmine.createSpy('get').and.returnValue(of('')),
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BannerService, useValue: bannerServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { EventInputComponent } from './event-input.component';
import { EventsService } from '../api/services/events.service';
import { BannerService } from '../services/banner.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

const eventsServiceMock = {
  getEvent: jasmine.createSpy('getEvent').and.returnValue(of({})),
  createEvent: jasmine.createSpy('createEvent'),
  updateEvent: jasmine.createSpy('updateEvent')
};

const bannerServiceMock = {
  updateBanner: jasmine.createSpy('updateBanner')
};

const loadingServiceMock = {
  loadingOn: jasmine.createSpy('loadingOn'),
  loadingOff: jasmine.createSpy('loadingOff')
};

const authServiceMock = {
  adminLoggedIn: jasmine.createSpy('adminLoggedIn').and.returnValue(false)
};

const translateServiceMock = {
  instant: jasmine.createSpy('instant').and.returnValue(''),
  get: jasmine.createSpy('get').and.returnValue(of('')),
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};

describe('EventInputComponent', () => {
  let component: EventInputComponent;
  let fixture: ComponentFixture<EventInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInputComponent],
      providers: [
        provideRouter([]),
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: BannerService, useValue: bannerServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

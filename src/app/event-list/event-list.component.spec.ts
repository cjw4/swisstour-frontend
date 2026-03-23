import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { EventListComponent } from './event-list.component';
import { EventsService } from '../api/services/events.service';
import { BannerService } from '../services/banner.service';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';

const eventServiceMock = {
  getEvents: jasmine.createSpy('getEvents').and.returnValue(of([])),
  getEventResults: jasmine.createSpy('getEventResults')
};

const bannerServiceMock = {
  updateBanner: jasmine.createSpy('updateBanner')
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

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        provideRouter([]),
        { provide: EventsService, useValue: eventServiceMock },
        { provide: BannerService, useValue: bannerServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

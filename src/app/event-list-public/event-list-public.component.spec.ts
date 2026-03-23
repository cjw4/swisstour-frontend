import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListPublicComponent } from './event-list-public.component';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { EventsService } from '../api/services';
import { APP_SETTINGS, appSettings } from '../app.settings';

const eventServiceMock = {
  getEvents: jasmine.createSpy('getEvents').and.returnValue(of([]))
};

const translateServiceMock = {
  instant: jasmine.createSpy('instant').and.returnValue(''),
  get: jasmine.createSpy('get').and.returnValue(of('')),
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};

describe('EventListPublicComponent', () => {
  let component: EventListPublicComponent;
  let fixture: ComponentFixture<EventListPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListPublicComponent],
      providers: [
        provideRouter([]),
        { provide: EventsService, useValue: eventServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: APP_SETTINGS, useValue: appSettings }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventListPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

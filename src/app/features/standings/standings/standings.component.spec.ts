import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { StandingsComponent } from './standings.component';
import { PlayersService } from '../../../api/services/players.service';
import { EventsService } from '../../../api/services/events.service';
import { StandingsService } from '../../../api/services/standings.service';
import { TranslateService } from '@ngx-translate/core';

const playersServiceMock = {
  getAllPlayers: jasmine.createSpy('getAllPlayers').and.returnValue(of([]))
};

const eventsServiceMock = {
  getEvents: jasmine.createSpy('getEvents').and.returnValue(of([]))
};

const standingsServiceMock = {
  getStandings: jasmine.createSpy('getStandings').and.returnValue(of([]))
};

const translateServiceMock = {
  instant: jasmine.createSpy('instant').and.returnValue(''),
  get: jasmine.createSpy('get').and.returnValue(of('')),
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};

describe('StandingsComponent', () => {
  let component: StandingsComponent;
  let fixture: ComponentFixture<StandingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandingsComponent],
      providers: [
        provideRouter([]),
        { provide: PlayersService, useValue: playersServiceMock },
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: StandingsService, useValue: standingsServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

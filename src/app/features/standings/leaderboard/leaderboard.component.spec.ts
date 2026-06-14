import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { convertToParamMap, provideRouter } from '@angular/router';
import { EventEmitter } from '@angular/core';

import { LeaderboardComponent } from './leaderboard.component';
import { ActivatedRoute } from '@angular/router';
import { PlayersService } from '../../../api/services/players.service';
import { StandingsService } from '../../../api/services/standings.service';
import { TranslateService } from '@ngx-translate/core';

const activatedRouteMock = {
  paramMap: of(convertToParamMap({ year: '2024' }))
};

const playersServiceMock = {
  getAllPlayers: jasmine.createSpy('getAllPlayers').and.returnValue(of([]))
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

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PlayersService, useValue: playersServiceMock },
        { provide: StandingsService, useValue: standingsServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { PlayerListComponent } from './player-list.component';
import { PlayersService } from '../api/services/players.service';
import { BannerService } from '../services/banner.service';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

const playersServiceMock = {
  getAllPlayers: jasmine.createSpy('getAllPlayers').and.returnValue(of([])),
  getPlayer: jasmine.createSpy('getPlayer'),
  deletePlayer: jasmine.createSpy('deletePlayer'),
  addPlayersFromGoogleSheet: jasmine.createSpy('addPlayersFromGoogleSheet')
};

const bannerServiceMock = {
  updateBanner: jasmine.createSpy('updateBanner')
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

describe('PlayerListComponent', () => {
  let component: PlayerListComponent;
  let fixture: ComponentFixture<PlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerListComponent],
      providers: [
        provideRouter([]),
        { provide: PlayersService, useValue: playersServiceMock },
        { provide: BannerService, useValue: bannerServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PlayersService } from '../api/services/players.service';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { PlayerInputComponent } from './player-input.component';

const playersServiceMock = {
  getPlayer: jasmine.createSpy('getPlayer'),
  createPlayer: jasmine.createSpy('createPlayer'),
  updatePlayer: jasmine.createSpy('updatePlayer')
};

const translateServiceMock = {
  instant: jasmine.createSpy('instant').and.returnValue(''),
  get: jasmine.createSpy('get').and.returnValue(of('')),
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};

describe('PlayerInputComponent', () => {
  let component: PlayerInputComponent;
  let fixture: ComponentFixture<PlayerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerInputComponent],
      providers: [
        provideRouter([]),
        { provide: PlayersService, useValue: playersServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

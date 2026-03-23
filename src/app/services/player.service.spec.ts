import { TestBed } from '@angular/core/testing';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
  let service: PlayerService;

  const playerServiceMock = {
    getPlayerEvents: jasmine.createSpy('getPlayerEvents')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PlayerService,
          useValue: playerServiceMock
        }
      ]
    });
    service = TestBed.inject(PlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

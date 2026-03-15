import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { PlayerService } from '../services/player.service';
import { PlayersService } from '../api/services/players.service';
import { PlayerDto } from '../api/models/player-dto';
import { PlayerStatistics } from '../interfaces/player-stats';

export interface PlayerDetailsData {
  player: PlayerDto;
  swisstourStats: PlayerStatistics;
  swissChampionshipStats: PlayerStatistics;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerDetailsResolver implements Resolve<PlayerDetailsData> {
  private playerService = inject(PlayerService);
  private playersService = inject(PlayersService);

  resolve(route: ActivatedRouteSnapshot): Observable<PlayerDetailsData> {
    const id = Number(route.paramMap.get('id'));
    return forkJoin({
      player: this.playersService.getPlayer({ id }),
      swisstourStats: this.playerService.getSwisstourStats(id),
      swissChampionshipStats: this.playerService.getSwisstourStats(id, true)
    });
  }
}

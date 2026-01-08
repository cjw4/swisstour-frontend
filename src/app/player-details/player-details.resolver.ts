import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { PlayerService } from '../services/player.service';
import { Player } from '../interfaces/player';
import { PlayerStatistics } from '../interfaces/player-stats';

export interface PlayerDetailsData {
  player: Player;
  swisstourStats: PlayerStatistics;
  swissChampionshipStats: PlayerStatistics;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerDetailsResolver implements Resolve<PlayerDetailsData> {
  private playerService = inject(PlayerService);

  resolve(route: ActivatedRouteSnapshot): Observable<PlayerDetailsData> {
    const id = Number(route.paramMap.get('id'));
    return forkJoin({
      player: this.playerService.getPlayer(id),
      swisstourStats: this.playerService.getSwisstourStats(id),
      swissChampionshipStats: this.playerService.getSwisstourStats(id, true)
    });
  }
}

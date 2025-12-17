import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { Player } from '../interfaces/player';
import { BannerService, BannerType } from './banner.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersUrl: string = inject(APP_SETTINGS).apiUrl + '/players'
  http = inject(HttpClient)
  bannerService = inject(BannerService)

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.playersUrl);
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(this.playersUrl + '/' + id);
  }

  addPlayer(player: any): Observable<Player> {
    return this.http.post<Player>(this.playersUrl, player);
  }

  updatePlayer(player: any, id: number | null): Observable<any> {
    return this.http.put<Player>(this.playersUrl + '/' + id, player)
  }

  deletePlayer(player: Player) {
    const url = `${this.playersUrl}/${player.id}`;
    return this.http.delete(url).pipe(
        tap(() => {
          this.bannerService.updateBanner(
            `Player was deleted.`,
            BannerType.SUCCESS
          );
        }),
        switchMap(() => this.getPlayers())
      );
  };

  getPlayersEvents(id: number) {
    const url = `${this.playersUrl}/events/${id}`
    return this.http.get(url);
  }
}

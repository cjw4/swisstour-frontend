import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Player } from '../interfaces/player';
import { BannerService, BannerType } from './banner.service';
import { DivisionStats } from '../interfaces/division-stats';

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

  getPlayersEvents(id: number): Observable<any[]> {
    const url = `${this.playersUrl}/events/${id}`
    return this.http.get<any[]>(url);
  }

  getPlayerStats(id: number) {
    return this.getPlayersEvents(id).pipe(
      map((response)=> {
        const stats: DivisionStats = {};

        // Process each tournament
        response.forEach(tournament =>{
          if (!tournament.isSwisstour) return;

          const division: string = tournament.division;

          // Initialize counts for each division
          if (!stats[division]) {
            stats[division] = {
              tournaments: 0,
              wins: 0,
              podiumFinishes: 0,
              top5Finishes: 0,
              top10Finishes: 0,
            };
          }

          // Add the tournament ID to the unique ID set
          stats[division].tournaments++;

          // Count finishes
          if ([1].includes(tournament.tournamentPlace)) {
            stats[division].wins++
          }
          if ([2, 3].includes(tournament.tournamentPlace)) {
              stats[division].podiumFinishes++;
            }
          if ([4, 5].includes(tournament.tournamentPlace)) {
            stats[division].top5Finishes++;
          }
          if (
            [6, 7, 8, 9, 10].includes(
              tournament.tournamentPlace
            )
          ) {
            stats[division].top10Finishes++;
          }

        });
        return stats;
      })
    )
  }
}

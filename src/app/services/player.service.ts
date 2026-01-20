import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Player } from '../interfaces/player';
import { BannerService, BannerType } from './banner.service';
import { environment } from '../../environments/environment';
import { PlayerStatistics } from '../interfaces/player-stats';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersUrl: string = environment.apiUrl + '/players'
  http = inject(HttpClient)
  bannerService = inject(BannerService)
  translateService = inject(TranslateService)

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
    return this.http.put<Player>(this.playersUrl + '/' + id, player);
  }

  deletePlayer(player: Player) {
    const url = `${this.playersUrl}/${player.id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        const message = this.translateService.instant('banners.playerDeleted');
        this.bannerService.updateBanner(message, BannerType.SUCCESS);
      }),
      switchMap(() => this.getPlayers())
    );
  }

  getPlayersEvents(id: number): Observable<any[]> {
    const url = `${this.playersUrl}/events/${id}`;
    return this.http.get<any[]>(url).pipe(
      map(events => events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()))
    );
  }

  getSwisstourStats(id: number, isChampionship: boolean = false) {
    return this.getPlayersEvents(id).pipe(
      map((response) => {
        const stats: PlayerStatistics = {};

        // Process each tournament
        response.forEach((tournament) => {
          if (!isChampionship && !tournament.isSwisstour) return;
          if (isChampionship && !tournament.isChampionship) return;

          const division: string = tournament.division;

          // Initialize counts for each division
          if (!stats[division]) {
            stats[division] = {
              tournaments: {
                count: 0,
                events: [],
              },
              wins: {
                count: 0,
                events: [],
              },
              podiumFinishes: {
                count: 0,
                events: [],
              },
              top5Finishes: {
                count: 0,
                events: [],
              },
              top10Finishes: {
                count: 0,
                events: [],
              },
            };
          }

          // Count the total number of tournaments in the division
          stats[division].tournaments.count++;
          // Record the event name, year and place
          stats[division].tournaments.events.push({
            name: tournament.displayName,
            year: tournament.year,
            place: tournament.tournamentPlace,
            category: tournament.division,
            eventId: tournament.eventId
          });

          // Do same for wins
          if ([1].includes(tournament.tournamentPlace)) {
            stats[division].wins.count++;
            stats[division].wins.events.push({
              name: tournament.displayName,
              year: tournament.year,
              place: tournament.tournamentPlace,
              category: tournament.division,
              eventId: tournament.eventId,
            });
          }
          // Do same for podium
          if ([2, 3].includes(tournament.tournamentPlace)) {
            stats[division].podiumFinishes.count++;
            stats[division].podiumFinishes.events.push({
              name: tournament.displayName,
              year: tournament.year,
              place: tournament.tournamentPlace,
              category: tournament.division,
              eventId: tournament.eventId,
            });
          }
          // Do same for top 5
          if ([4, 5].includes(tournament.tournamentPlace)) {
            stats[division].top5Finishes.count++;
            stats[division].top5Finishes.events.push({
              name: tournament.displayName,
              year: tournament.year,
              place: tournament.tournamentPlace,
              category: tournament.division,
              eventId: tournament.eventId,
            });
          }
          // Do same for top 10
          if ([6, 7, 8, 9, 10].includes(tournament.tournamentPlace)) {
            stats[division].top10Finishes.count++;
            stats[division].top10Finishes.events.push({
              name: tournament.displayName,
              year: tournament.year,
              place: tournament.tournamentPlace,
              category: tournament.division,
              eventId: tournament.eventId,
            });
          }
        });
        return stats;
      })
    );
  }
}

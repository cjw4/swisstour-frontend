import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PlayerStatistics } from '../interfaces/player-stats';
import { PlayersService } from '../api/services/players.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersService = inject(PlayersService);

  getSwisstourStats(id: number, isChampionship = false): Observable<PlayerStatistics> {
    return this.playersService.getPlayerEvents({ id }).pipe(
      map((response) => {
        const stats: PlayerStatistics = {};

        // Process each tournament
        response.forEach((tournament) => {
          if (!isChampionship && !tournament.isSwisstour) return;
          if (isChampionship && !tournament.isChampionship) return;

          const division: string = tournament.division!;

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
            name: tournament.displayName!,
            year: tournament.year!,
            place: tournament.tournamentPlace!,
            category: tournament.division!,
            eventId: tournament.eventId!
          });

          // Do same for wins
          if ([1].includes(tournament.tournamentPlace!)) {
            stats[division].wins.count++;
            stats[division].wins.events.push({
              name: tournament.displayName!,
              year: tournament.year!,
              place: tournament.tournamentPlace!,
              category: tournament.division!,
              eventId: tournament.eventId!,
            });
          }
          // Do same for podium
          if ([2, 3].includes(tournament.tournamentPlace!)) {
            stats[division].podiumFinishes.count++;
            stats[division].podiumFinishes.events.push({
              name: tournament.displayName!,
              year: tournament.year!,
              place: tournament.tournamentPlace!,
              category: tournament.division!,
              eventId: tournament.eventId!,
            });
          }
          // Do same for top 5
          if ([4, 5].includes(tournament.tournamentPlace!)) {
            stats[division].top5Finishes.count++;
            stats[division].top5Finishes.events.push({
              name: tournament.displayName!,
              year: tournament.year!,
              place: tournament.tournamentPlace!,
              category: tournament.division!,
              eventId: tournament.eventId!,
            });
          }
          // Do same for top 10
          if ([6, 7, 8, 9, 10].includes(tournament.tournamentPlace!)) {
            stats[division].top10Finishes.count++;
            stats[division].top10Finishes.events.push({
              name: tournament.displayName!,
              year: tournament.year!,
              place: tournament.tournamentPlace!,
              category: tournament.division!,
              eventId: tournament.eventId!,
            });
          }
        });
        return stats;
      })
    );
  }
}

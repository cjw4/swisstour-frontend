import { Component, inject, input, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { EventDto } from '../api/models/event-dto';
import { EventsService } from '../api/services/events.service';
import { map, Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { StandingDto } from '../api/models/standing-dto';
import { PlayersService } from '../api/services/players.service';
import { PlayerDto } from '../api/models/player-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { StandingsService } from '../api/services/standings.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-standings',
  imports: [AsyncPipe, CommonModule, TranslateModule],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class StandingsComponent {
  // inject dependencies
  private activatedRoute = inject(ActivatedRoute);
  private playersService = inject(PlayersService);
  private eventsService = inject(EventsService);
  private standingsService = inject(StandingsService);
  router = inject(Router);

  // define variables
  events$: Observable<EventDto[]> | undefined;
  players$: Observable<PlayerDto[]> | undefined;
  standings$: Observable<StandingDto[]> | undefined;
  category: string | null = '';
  year: number | undefined;
  playersSignal: Signal<any>;
  appSettings = appSettings;

  constructor() {
    this.activatedRoute.paramMap
      .pipe(
        map((params) => ({
          category: params.get('category'),
          year: params.get('year'),
        })),
        tap(({category, year}) => {
          this.category = category;
          this.year = Number(year)
        }),
        tap(() => {
          this.getStandings();
          this.getEvents();
        })
      )
      .subscribe();
    // assign the observable of all players to a signal
    this.playersSignal = toSignal(this.playersService.getAllPlayers());
  }

  public getStandings() {
    this.standings$ = this.standingsService.getStandings({ year: this.year!, division: this.category! });
  }

  public getEvents() {
    this.events$ = this.eventsService.getEventsByYear({ year: this.year!, division: this.category! }).pipe(
      map((events) => events.filter((event) => event.isSwisstour)),
      map((events) => events.filter((event) => event.hasResults)),
      map((events) =>
        events.sort(
          (a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()
        )
      )
    );
  }

  public getPlayers() {
    this.players$ = this.playersService.getAllPlayers();
  }

  findPlayer(playerId: number) {
    const players = this.playersSignal();
    const player = players.find((p: { id: number }) => p.id === playerId);
    return player;
  }

  hasEventId(standing: StandingDto, eventIdToFind: number): boolean {
    return standing.eventPoints?.some(
      (event) => event.eventId === eventIdToFind
    ) ?? false;
  }

  getEventPoints(standing: StandingDto, eventIdToFind: number): number {
    const foundEvent = standing.eventPoints?.find(
      (event) => event.eventId === eventIdToFind
    );
    return foundEvent?.points ?? 0;
  }

  isEventIncluded(standing: StandingDto, eventIdToFind: number): boolean {
    const foundEvent = standing.eventPoints?.find(
      (event) => event.eventId == eventIdToFind
    );
    return foundEvent?.included ?? false;
  }
}

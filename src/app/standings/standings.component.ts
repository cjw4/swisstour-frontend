import { HttpClient } from '@angular/common/http';
import { Component, inject, input, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { PdgaEvent } from '../interfaces/pdga-event';
import { EventsService } from '../services/events.service';
import { filter, map, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StandingsDTO } from '../interfaces/standings-dto';
import { PlayerService } from '../services/player.service';
import { Player } from '../interfaces/player';
import { ActivatedRoute, Router } from '@angular/router';
import { StandingsService } from '../services/standings.service';

@Component({
  selector: 'app-standings',
  imports: [AsyncPipe],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class StandingsComponent {
  // inject dependencies
  private activatedRoute = inject(ActivatedRoute);
  private playerService = inject(PlayerService);
  private eventsService = inject(EventsService);
  private standingService = inject(StandingsService);
  router = inject(Router);

  // define variables
  events$: Observable<PdgaEvent[]> | undefined;
  players$: Observable<Player[]> | undefined;
  standings$: Observable<StandingsDTO[]> | undefined;
  category: string | null = '';
  playersSignal: Signal<any>;

  constructor() {
    this.activatedRoute.paramMap.pipe(
        map(params => params.get('category')),
        tap(category => {this.category = category}),
        tap(() => {
          this.getStandings();
          this.getEvents()
        })
    ).subscribe();
    // assign the observable of all players to a signal
    this.playersSignal = toSignal(this.playerService.getPlayers());
  }

  public getStandings() {
    this.standings$ = this.standingService.getStanding(this.category);
  }

  public getEvents() {
    this.events$ = this.eventsService.getEvents().pipe(
      map((events) => events.filter((event) => event.isSwisstour)),
      map((events) => events.filter((event) => event.hasResults)),
      map((events) =>
        events.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      )
    );
  }

  public getPlayers() {
    this.players$ = this.playerService.getPlayers();
  }

  findPlayer(playerId: number) {
    const players = this.playersSignal();
    const player = players.find((p: { id: number }) => p.id === playerId);
    return player;
  }

  hasEventId(standing: StandingsDTO, eventIdToFind: number): boolean {
    return standing.eventPoints.some(
      (event) => event.eventId === eventIdToFind
    );
  }

  getEventPoints(standing: StandingsDTO, eventIdToFind: number): number {
    const foundEvent = standing.eventPoints.find(
      (event) => event.eventId === eventIdToFind
    );
    return foundEvent ? foundEvent.points : 0;
  }

  isEventIncluded(standing: StandingsDTO, eventIdToFind: number): boolean {
    const foundEvent = standing.eventPoints.find(
      (event) => event.eventId == eventIdToFind
    );
    console.log(
      `Event ID: ${eventIdToFind}, ${foundEvent?.included}`
    );
    return foundEvent?.included ?? false;
  }
}

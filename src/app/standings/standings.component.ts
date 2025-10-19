import { HttpClient } from '@angular/common/http';
import { Component, inject, input, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { PdgaEvent } from '../interfaces/pdga-event';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StandingsDTO } from '../interfaces/standings-dto';
import { PlayerService } from '../services/player.service';
import { Player } from '../interfaces/player';

@Component({
  selector: 'app-standings',
  imports: [AsyncPipe],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class StandingsComponent implements OnInit {
  category = input();
  private eventsService: EventsService;
  private playerService: PlayerService;
  playersSignal: Signal<any>;

  constructor() {
    this.eventsService = new EventsService();
    this.playerService = new PlayerService();
    this.playersSignal = toSignal(this.playerService.getPlayers())
  }

  http = inject(HttpClient);

  events$: Observable<PdgaEvent[]> | undefined;
  players$: Observable<Player[]> | undefined;
  settings = inject(APP_SETTINGS);
  standingsUrl = this.settings.apiUrl + '/standings/' + this.category;
  standings: any;

  public getStandings() {
    this.http
      .get(this.standingsUrl)
      .subscribe((result: any) => (this.standings = result));
  }

  public getEvents() {
    this.events$ = this.eventsService.getEvents();
  }

  public getPlayers() {
    this.players$ = this.playerService.getPlayers();
  }

  findPlayer(playerId: number) {
    const players = this.playersSignal();
    const player = players.find((p: { id: number; }) => p.id === playerId);
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

  ngOnInit(): void {
    this.getStandings();
    this.getEvents();
    this.getPlayers();
    debugger;
  }

  onCategoryChange(): void {
    this.standingsUrl = this.settings.apiUrl + '/standings/' + this.category;
    this.getStandings();
  }
}

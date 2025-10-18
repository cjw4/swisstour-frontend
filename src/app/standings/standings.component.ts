import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { PdgaEvent } from '../interfaces/pdga-event';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { StandingsDTO } from '../interfaces/standings-dto';

@Component({
  selector: 'app-standings',
  imports: [AsyncPipe],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class StandingsComponent implements OnInit {
  public category: String = 'MPO';
  private eventsService: EventsService;

  constructor() {
    this.eventsService = new EventsService();
  }

  http = inject(HttpClient);

  events$: Observable<PdgaEvent[]> | undefined;
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

  hasEventId(standing: StandingsDTO, eventIdToFind: number): boolean {
    return standing.eventPoints.some(
      (event) => event.eventId === eventIdToFind
    );
  }

  getEventPoints(standing: StandingsDTO, eventIdToFind: number): number {
    const foundEvent = standing.eventPoints.find((event) => event.eventId === eventIdToFind);
    return foundEvent ? foundEvent.points : 0;
  }

  ngOnInit(): void {
    this.getStandings();
    this.getEvents();
    debugger;
  }
}

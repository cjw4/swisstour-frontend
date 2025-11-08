import { Component, inject, input, OnInit, output } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { PdgaEvent } from '../interfaces/pdga-event';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { NgClass } from '@angular/common';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-event-list',
  imports: [NgClass],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class EventListComponent {
  // inject services
  private eventService = inject(EventsService);
  private resultsService = inject(ResultsService);

  // inputs and outputs
  events = input<PdgaEvent[]>();
  addedResults = output<number | null>();
  deletedEvent = output<PdgaEvent>();
  selectedEvent = output<number>();

  // observables
  event$: Observable<PdgaEvent> | undefined;
  events$: Observable<PdgaEvent[]> | undefined;

  // functions
  public getEvent(id: number) {
    this.selectedEvent.emit(id);
  }

  public addResults(id: number) {
    this.addedResults.emit(id);
  }

  public deleteEvent(event: PdgaEvent) {
    if (confirm(`Are you sure you want to delete pdga event ${event.id}?`)) {
      this.deletedEvent.emit(event);
    }
  }
}

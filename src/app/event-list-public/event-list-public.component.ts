import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../api/services';
import { Observable } from 'rxjs';
import { EventDto } from '../api/models';
import { AsyncPipe } from '@angular/common';
import { APP_SETTINGS } from '../app.settings';
import { TranslateModule } from '@ngx-translate/core';
import { DateRangePipe } from '../pipes/date-range.pipe';

@Component({
  selector: 'app-event-list-public',
  imports: [AsyncPipe, TranslateModule, DateRangePipe],
  templateUrl: './event-list-public.component.html',
  styleUrl: './event-list-public.component.css'
})
export class EventListPublicComponent implements OnInit {
  // inject services
  private eventService = inject(EventsService);
  private activatedRoute = inject(ActivatedRoute);

  // variables
  year: number | undefined;
  events$: Observable<EventDto[]> | undefined;
  appSettings = inject(APP_SETTINGS);

  ngOnInit(): void {
    const yearParam = Number(this.activatedRoute.snapshot.paramMap.get('year'));
    this.year = yearParam;
    this.events$ = this.eventService.getEvents({year: yearParam})
  }


}

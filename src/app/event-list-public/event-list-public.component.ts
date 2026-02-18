import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../api/services';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs';
import { EventDto } from '../api/models';
import { AsyncPipe } from '@angular/common';
import { APP_SETTINGS } from '../app.settings';
import { TranslateModule } from '@ngx-translate/core';
import { DateRangePipe } from '../pipes/date-range.pipe';
import { LocalLoadingIndicatorComponent } from '../local-loading-indicator/local-loading-indicator.component';

@Component({
  selector: 'app-event-list-public',
  imports: [AsyncPipe, TranslateModule, DateRangePipe, LocalLoadingIndicatorComponent],
  templateUrl: './event-list-public.component.html',
  styleUrl: './event-list-public.component.css'
})
export class EventListPublicComponent implements OnInit {
  // inject services
  private eventService = inject(EventsService);
  private activatedRoute = inject(ActivatedRoute);

  // variables
  events$: Observable<EventDto[]> | undefined;
  appSettings = inject(APP_SETTINGS);
  year: number = this.appSettings.eventYear;
  loading = signal(false);

  ngOnInit(): void {
    const yearParam = Number(this.activatedRoute.snapshot.paramMap.get('year'));
    if (yearParam) {
      this.year = yearParam;
    }

    this.loading.set(true);
    this.events$ = this.eventService.getEvents({ year: this.year }).pipe(
      finalize(() => this.loading.set(false))
    );
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { BannerInfo } from '../interfaces/banner-info';
import { EventDto } from '../api/models/event-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../api/services/events.service';
import { BannerService, BannerType } from '../services/banner.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-event-create',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './event-input.component.html',
  styleUrl: './event-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings },
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },
    provideNativeDateAdapter()
  ],
})
export class EventInputComponent implements OnInit {
  // inject dependencies
  eventService = inject(EventsService);
  bannerService = inject(BannerService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  loadingService = inject(LoadingService);
  authService = inject(AuthService);
  translateService = inject(TranslateService);

  //variables
  event = input<EventDto>();
  isEvent = signal(false);
  eventId: number | null = null;
  editMode: boolean = false;

  // lifecycle hooks
  ngOnInit(): void {
    // check if the parameter id exists
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');

      // convert to number if exists, otherwise set to null
      this.eventId = id ? Number(id) : null;

      // patch the form with existing event data if we are editing
      if (this.eventId) {
        this.editMode = true;
        this.eventService.getEvent({ id: this.eventId }).subscribe((event) => {
          this.eventForm.patchValue({
            eventId: event.eventId,
            displayName: event.displayName,
            city: event.city,
            points: event.points,
            year: event.year,
            infoLink: event.infoLink,
            registrationLink: event.registrationLink,
            registrationStart: event.registrationStart,
            swisstourType: event.swisstourType,
            isChampionship: event.isChampionship,
            isSwisstour: event.isSwisstour,
            startDate: event.startDate,
            endDate: event.endDate
          });
          this.updatePdgaFieldsState(event.eventId);
        });
      }
    });

    // Listen to eventId changes to disable/enable date and city fields
    this.eventForm.get('eventId')?.valueChanges.subscribe((value) => {
      this.updatePdgaFieldsState(value);
    });
  }

  private updatePdgaFieldsState(eventId: number | null | undefined): void {
    const fields = ['startDate', 'endDate', 'city'];
    if (eventId) {
      fields.forEach(field => this.eventForm.get(field)?.disable());
    } else {
      fields.forEach(field => this.eventForm.get(field)?.enable());
    }
  }

  // create form
  eventForm = new FormGroup({
    eventId: new FormControl<number | null>(null),
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    city: new FormControl(''),
    points: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ]),
    year: new FormControl<number | null>(null, [Validators.required, Validators.pattern(/^\d+$/)]),
    infoLink: new FormControl(''),
    registrationLink: new FormControl(''),
    registrationStart: new FormControl(''),
    swisstourType: new FormControl(''),
    isChampionship: new FormControl(false),
    isSwisstour: new FormControl(false),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });
  isFormInvalid = this.eventForm.invalid;

  refreshEvents = output();
  settings = inject(APP_SETTINGS);

  bannerInfoOutput = output<BannerInfo>();
  bannerInfo: BannerInfo | undefined;

  private emitBannerInfo(bannerInfo: BannerInfo) {
    this.bannerInfoOutput.emit(bannerInfo);
  }

  private formatDate(date: Date | string | null): string | undefined {
    if (!date) return undefined;
    if (typeof date === 'string') return date;
    // Use local date methods to avoid timezone shift
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const rawValue = this.eventForm.getRawValue();
    const formValue: EventDto = {
      ...rawValue,
      displayName: rawValue.displayName ?? undefined,
      infoLink: rawValue.infoLink ?? undefined,
      registrationLink: rawValue.registrationLink ?? undefined,
      registrationStart: this.formatDate(rawValue.registrationStart),
      swisstourType: rawValue.swisstourType ?? undefined,
      eventId: rawValue.eventId ?? undefined,
      points: rawValue.points ?? 0,
      year: rawValue.year ?? undefined,
      city: rawValue.city ?? undefined,
      isChampionship: rawValue.isChampionship ?? false,
      isSwisstour: rawValue.isSwisstour ?? false,
      startDate: this.formatDate(rawValue.startDate),
      endDate: this.formatDate(rawValue.endDate)
    };
    const isEdit = this.editMode;
    const request = isEdit
      ? this.eventService.updateEvent({ id: this.eventId!, body: formValue })
      : this.eventService.createEvent({ body: formValue });

    // enable loader
    this.loadingService.loadingOn();

    request.subscribe({
      next: (res) => {
        let message: string
        if (res.eventId) {
          message = this.translateService.instant('banners.eventSaved', {
            id: res.eventId,
            name: res.name,
          });
        } else {
          message = this.translateService.instant('banners.eventSaved', {
            id: res.id,
            name: res.displayName
          });
        }

        this.bannerService.updateBanner(message, BannerType.SUCCESS);
        this.router.navigate(['/events', res.year]);
        this.loadingService.loadingOff();
      },
      error: (err: HttpErrorResponse) => {
        const message = this.translateService.instant('banners.eventSaveError', { error: err.error?.message });
        this.bannerService.updateBanner(message, BannerType.ERROR);
        this.loadingService.loadingOff();
      },
    });

  }

  get eventIdControl() {
    return this.eventForm.get('eventId');
  }

  get displayName() {
    return this.eventForm.get('displayName');
  }

  get points() {
    return this.eventForm.get('points');
  }
}

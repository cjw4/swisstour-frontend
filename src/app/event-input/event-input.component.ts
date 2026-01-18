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

@Component({
  selector: 'app-event-create',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './event-input.component.html',
  styleUrl: './event-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
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
          });
        });
      }
    });
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
  });
  isFormInvalid = this.eventForm.invalid;

  refreshEvents = output();
  settings = inject(APP_SETTINGS);

  bannerInfoOutput = output<BannerInfo>();
  bannerInfo: BannerInfo | undefined;

  private emitBannerInfo(bannerInfo: BannerInfo) {
    this.bannerInfoOutput.emit(bannerInfo);
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
      registrationStart: rawValue.registrationStart ?? undefined,
      swisstourType: rawValue.swisstourType ?? undefined,
      eventId: rawValue.eventId ?? undefined,
      points: rawValue.points ?? 0,
      year: rawValue.year ?? undefined,
      city: rawValue.city ?? undefined,
      isChampionship: rawValue.isChampionship ?? false,
      isSwisstour: rawValue.isSwisstour ?? false,
    };
    const isEdit = this.editMode;
    const request = isEdit
      ? this.eventService.updateEvent({ id: this.eventId!, body: formValue })
      : this.eventService.createEvent({ body: formValue });

    // enable loader
    this.loadingService.loadingOn();

    request.subscribe({
      next: (res) => {
        const message = this.translateService.instant('banners.eventSaved', { id: res.eventId, name: res.name });
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

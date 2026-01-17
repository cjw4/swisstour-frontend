import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { BannerInfo } from '../interfaces/banner-info';
import { PdgaEvent } from '../interfaces/pdga-event';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../services/events.service';
import { BannerService, BannerType } from '../services/banner.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
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
  event = input<PdgaEvent>();
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
        this.eventService.getEvent(this.eventId).subscribe((event) => {
          this.eventForm.patchValue({
            id: event.eventId?.toString(),
            displayName: event.displayName,
            points: event.points.toString(),
            year: event.year.toString(),
            isChampionship: event.isChampionship,
            isSwisstour: event.isSwisstour,
          });
        });
      }
    });
  }

  // create form
  eventForm = new FormGroup({
    id: new FormControl(''),
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    points: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ]),
    year: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    isChampionship: new FormControl(false),
    isSwisstour: new FormControl(false),
  });
  isFormInvalid = this.eventForm.invalid;

  http = inject(HttpClient);
  refreshEvents = output();
  settings = inject(APP_SETTINGS);
  eventUrl = environment.apiUrl + '/events';

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

    const formValue = this.eventForm.value;
    const isEdit = this.editMode;
    const request = isEdit
      ? this.http.put<PdgaEvent>(this.eventUrl + '/' + formValue.id, formValue)
      : this.http.post<PdgaEvent>(this.eventUrl, formValue);

    // enable loader
    this.loadingService.loadingOn();

    request.subscribe({
      next: (res) => {
        const message = this.translateService.instant('banners.eventSaved', { id: res.id, name: res.name });
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

  get id() {
    return this.eventForm.get('id');
  }

  get displayName() {
    return this.eventForm.get('displayName');
  }

  get points() {
    return this.eventForm.get('points');
  }
}

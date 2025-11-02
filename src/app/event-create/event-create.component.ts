import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { BannerInfo } from '../interfaces/banner-info';
import { PdgaEvent } from '../interfaces/pdga-event';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-create',
  imports: [ReactiveFormsModule],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class EventCreateComponent {
  event = input<PdgaEvent>();
  eventForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    points: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ]),
    isChampionship: new FormControl(false),
    isSwisstour: new FormControl(false),
  });

  constructor() {
    // Create an effect to watch for event changes
    effect(() => {
      const currentEvent = this.event();
      if (currentEvent) {
        this.eventForm.patchValue({
          id: currentEvent.id.toString(),
          displayName: currentEvent.displayName,
          points: currentEvent.points.toString(),
          isChampionship: currentEvent.isChampionship,
          isSwisstour: currentEvent.isSwisstour,
        });
      }
    });
  }

  isFormInvalid = this.eventForm.invalid;

  http = inject(HttpClient);
  refreshEvents = output();
  settings = inject(APP_SETTINGS);
  eventUrl = this.settings.apiUrl + '/events';

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
    const isEdit = !!this.event();

    // Choose between PATCH and POST based on whether we're editing
    const request = isEdit
      ? this.http.put<PdgaEvent>(this.eventUrl, formValue)
      : this.http.post<PdgaEvent>(this.eventUrl, formValue);

    request.subscribe({
      next: (res) => {
        this.bannerInfo = {
          message: `PDGA event ${res.id} (${res.displayName}) was ${isEdit ? 'updated' : 'created'}.`,
          visible: true,
          type: 'success',
        };
        this.emitBannerInfo(this.bannerInfo);
        this.refreshEvents.emit();

        this.eventForm.reset({
          id: null,
          displayName: '',
          points: '',
          isChampionship: false,
          isSwisstour: false,
        });
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = err.error?.message ?? 'An unknown error occurred.';
        this.bannerInfo = {
          message: errorMessage,
          visible: true,
          type: 'error',
        };
        this.emitBannerInfo(this.bannerInfo);
      }
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

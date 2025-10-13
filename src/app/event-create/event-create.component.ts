import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { BannerInfo } from '../interfaces/banner-info';

@Component({
  selector: 'app-event-create',
  imports: [ReactiveFormsModule],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class EventCreateComponent {
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
      this.eventForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }
    if (this.eventForm.valid) {
      this.http.post(this.eventUrl, this.eventForm.value).subscribe({
        next: (res: any) => {
          this.bannerInfo = {
            message: `PDGA event ${res.id} (${res.name}) was added.`,
            visible: true,
            type: 'success',
          };
          this.emitBannerInfo(this.bannerInfo);
          this.refreshEvents.emit();
          // this.eventListComponent.getEvents(); // Refresh the event list
          this.eventForm.reset({
            id: '',
            displayName: '',
            points: '',
            isChampionship: false,
            isSwisstour: false,
          }); // Reset the form after submission
        },
        error: (err) => {
          const serverError = err.error;
          const errorMessage =
            serverError?.message || 'An unknown error occured.';
          this.bannerInfo = {
            message: errorMessage,
            visible: true,
            type: 'error',
          };
          this.emitBannerInfo(this.bannerInfo);
        },
      });
    }
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

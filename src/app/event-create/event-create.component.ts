import { HttpClient } from '@angular/common/http';
import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { EventListComponent } from '../event-list/event-list.component';
import { BannerInfo } from '../interfaces/banner-info';

@Component({
  selector: 'app-event-create',
  imports: [ReactiveFormsModule],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.css',
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
})
export class EventCreateComponent {

  eventForm = new FormGroup({
    id: new FormControl(''),
    displayName: new FormControl(''),
    points: new FormControl(''),
    isChampionship: new FormControl(false),
    isSwisstour: new FormControl(false)
  });

  http = inject(HttpClient);
  eventListComponent = inject(EventListComponent);
  settings = inject(APP_SETTINGS);
  eventUrl = this.settings.apiUrl + '/events';

  bannerInfoOutput = output<BannerInfo>();
  bannerInfo : BannerInfo | undefined;

  private emitBannerInfo(bannerInfo: BannerInfo) {
    debugger;
    this.bannerInfoOutput.emit(bannerInfo);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.http.post(this.eventUrl, this.eventForm.value)
        .subscribe({
          next: (res: any) => {
            debugger;
            this.bannerInfo = {
              message: `PDGA event ${res.id} (${res.name}) was added.`,
              visible: true,
              type: 'success'
            }
            this.emitBannerInfo(this.bannerInfo);
            this.eventListComponent.getEvents(); // Refresh the event list
            this.eventForm.reset(); // Reset the form after submission
          },
          error: (err) => {
            this.bannerInfo = {
              message: "Error creating event: " + err.message,
              visible: true,
              type: 'error'
            }
            this.emitBannerInfo(this.bannerInfo);
          }
        });
    }
  }


}

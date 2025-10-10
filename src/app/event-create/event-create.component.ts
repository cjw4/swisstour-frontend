import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { EventListComponent } from '../event-list/event-list.component';

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

  constructor() { }

  onSubmit() {
    if (this.eventForm.valid) {
      debugger;
      this.http.post(this.eventUrl, this.eventForm.value)
        .subscribe({
          next: (res) => {
            // handle success, e.g. show a message or redirect
            console.log('Event created:', res);
            this.eventListComponent.getEvents(); // Refresh the event list
            this.eventForm.reset(); // Reset the form after submission
          },
          error: (err) => {
            // handle error
            console.error('Error creating event:', err);
          }
        });
    }
  }


}

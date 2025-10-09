import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-create',
  imports: [FormsModule],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.css'
})
export class EventCreateComponent {
  eventForm: FormGroup;
  http = inject(HttpClient);

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      eventName: ['', Validators.required],
      displayName: ['', Validators.required],
      points: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      isChampionship: [false],
      isSwisstour: [true]
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.http.post('http://localhost:8080/api/events', this.eventForm.value)
        .subscribe({
          next: (res) => {
            // handle success, e.g. show a message or redirect
            console.log('Event created:', res);
          },
          error: (err) => {
            // handle error
            console.error('Error creating event:', err);
          }
        });
    }
  }


}

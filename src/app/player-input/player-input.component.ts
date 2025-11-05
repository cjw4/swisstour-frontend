import { Component, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-player-input',
  imports: [ReactiveFormsModule],
  templateUrl: './player-input.component.html',
  styleUrl: './player-input.component.css',
})
export class PlayerInputComponent {
  // inject services
  playerService = inject(PlayerService);

  // signals
  player = input<Player>();
  isPlayer = signal(false);

  // create player form
  playerForm = new FormGroup({
    pdgaNumber: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    sdaNumber: new FormControl(''),
    swisstourLicense: new FormControl(false),
  });

  constructor() {
    effect(() => {
      const currentPlayer = this.player();
      if (currentPlayer) {
        this.isPlayer.set(true);
        this.playerForm.patchValue({
          pdgaNumber: currentPlayer.pdgaNumber.toString(),
          firstname: currentPlayer.firstname,
          lastname: currentPlayer.lastname,
          swisstourLicense: currentPlayer.swisstourLicense
        });
      }
    });
  }

  onSubmit() {
    const formValue = this.playerForm.value;
    const isEdit = !!this.player();
    debugger;
    const request = isEdit
      ? this.playerService.updatePlayer(formValue, this.player()!.id)
      : this.playerService.addPlayer(formValue);

    request.subscribe({
      next: (res) => {
        this.playerForm.reset({
          pdgaNumber: null,
          firstname: '',
          lastname: '',
          swisstourLicense: false,
          sdaNumber: null,
        });
        this.isPlayer.set(false);
      },
    });
  }
}

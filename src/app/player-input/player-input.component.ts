import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { BannerService, BannerType } from '../services/banner.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-player-input',
  imports: [ReactiveFormsModule],
  templateUrl: './player-input.component.html',
  styleUrl: './player-input.component.css',
})
export class PlayerInputComponent {
  // inject services
  playerService = inject(PlayerService);
  bannerService = inject(BannerService);

  // signals
  player = input<Player>();
  refreshList = output();
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
        this.bannerService.updateBanner(`Player ${formValue.firstname} ${formValue.lastname} was saved`, BannerType.SUCCESS);
        this.isPlayer.set(false);
        this.refreshList.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.bannerService.updateBanner(`Player could not be saved: ${err.error?.message}`, BannerType.ERROR);
      }
    });
  }
}

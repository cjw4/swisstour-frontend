import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { BannerService, BannerType } from '../services/banner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-player-input',
  imports: [ReactiveFormsModule],
  templateUrl: './player-input.component.html',
  styleUrl: './player-input.component.css',
})
export class PlayerInputComponent implements OnInit {
  // inject services
  playerService = inject(PlayerService);
  bannerService = inject(BannerService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  loadingService = inject(LoadingService);

  // variables
  playerId: number | null = null;
  editMode: boolean = false;

  // lifecycle hooks
  ngOnInit(): void {
    // check if the parameter id exists
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      // convert to number if exists, otherwise set to null
      this.playerId = id ? Number(id) : null

      // patch the form with existing player data if we are editing
      if (this.playerId) {
        this.editMode = true;
        this.playerService.getPlayer(this.playerId).subscribe(player => {
          this.playerForm.patchValue({
            pdgaNumber: player.pdgaNumber?.toString(),
            firstname: player.firstname,
            lastname: player.lastname,
            swisstourLicense: player.swisstourLicense,
            sdaNumber: player.sdaNumber?.toString()
          });
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.playerForm.get('pdgaNumber')?.valueChanges.subscribe((value) => {
      const firstnameControl = this.playerForm.get('firstname');
      const lastnameControl = this.playerForm.get('lastname');
      if (value) {
        this.playerForm.patchValue({
          firstname: '',
          lastname: ''
        });
      }
    });
  }

  // create player form
  playerForm = new FormGroup({
    id: new FormControl(''),
    pdgaNumber: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    sdaNumber: new FormControl(''),
    swisstourLicense: new FormControl(false),
    isPro: new FormControl(false)
  });

  onSubmit() {
    const formValue = this.playerForm.value;
    const isEdit = this.editMode;
    const request = isEdit
      ? this.playerService.updatePlayer(formValue, this.playerId)
      : this.playerService.addPlayer(formValue);

    this.loadingService.loadingOn();
    request.subscribe({
      next: (res) => {
        this.bannerService.updateBanner(`Player ${res} was saved`, BannerType.SUCCESS);
        this.router.navigate(['/players']);
        this.loadingService.loadingOff();
      },
      error: (err: HttpErrorResponse) => {
        this.bannerService.updateBanner(`Player could not be saved: ${err.error?.message}`, BannerType.ERROR);
        this.loadingService.loadingOff();
      }
    });
  }
}

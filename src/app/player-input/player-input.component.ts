import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlayerDto } from '../api/models/player-dto';
import { PlayersService } from '../api/services/players.service';
import { BannerService, BannerType } from '../services/banner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-player-input',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './player-input.component.html',
  styleUrl: './player-input.component.css',
})
export class PlayerInputComponent implements OnInit {
  // inject services
  playersService = inject(PlayersService);
  bannerService = inject(BannerService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  loadingService = inject(LoadingService);
  translateService = inject(TranslateService);

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
        this.playersService.getPlayer({ id: this.playerId }).subscribe(player => {
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
    const formValue = this.playerForm.value as PlayerDto;
    const isEdit = this.editMode;
    const request = isEdit
      ? this.playersService.updatePlayer({ id: this.playerId!, body: formValue })
      : this.playersService.createPlayer({ body: formValue });

    this.loadingService.loadingOn();
    request.subscribe({
      next: (res) => {
        const message = this.translateService.instant('banners.playerSaved', { name: res });
        this.bannerService.updateBanner(message, BannerType.SUCCESS);
        this.router.navigate(['/players']);
        this.loadingService.loadingOff();
      },
      error: (err: HttpErrorResponse) => {
        const message = this.translateService.instant('banners.playerSaveError', { error: err.error?.message });
        this.bannerService.updateBanner(message, BannerType.ERROR);
        this.loadingService.loadingOff();
      }
    });
  }
}

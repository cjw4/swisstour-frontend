import { Component, inject, OnInit } from '@angular/core';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { AsyncPipe } from '@angular/common';
import { PlayerInputComponent } from '../player-input/player-input.component';
import { BannerService, BannerType } from '../services/banner.service';

@Component({
  selector: 'app-player-list',
  imports: [AsyncPipe, PlayerInputComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class PlayerListComponent implements OnInit {
  // inject services
  playerService = inject(PlayerService);
  bannerService = inject(BannerService);

  players$: Observable<Player[]> | undefined;
  player$: Observable<Player> | undefined;

  getPlayers() {
    this.players$ = this.playerService.getPlayers();
  }

  getPlayer(id: number) {
    this.player$ = this.playerService.getPlayer(id);
  }

  deletePlayer(player: Player) {
    if (confirm(`Are you sure you want to delete the player ${player.firstname} ${player.lastname}?`)) {
      this.playerService.deletePlayer(player).subscribe((res) => {
        this.bannerService.updateBanner(
          `Player was deleted.`,
          BannerType.SUCCESS
        );
        this.getPlayers();
      });
    }
  }

  ngOnInit(): void {
    this.getPlayers();
  }
}

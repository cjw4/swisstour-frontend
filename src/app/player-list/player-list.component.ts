import { Component, inject, OnInit } from '@angular/core';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { AsyncPipe } from '@angular/common';
import { BannerService, BannerType } from '../services/banner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-list',
  imports: [AsyncPipe],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class PlayerListComponent implements OnInit {
  // inject services
  playerService = inject(PlayerService);
  bannerService = inject(BannerService);
  router = inject(Router)

  players$: Observable<Player[]> | undefined;
  player$: Observable<Player> | undefined;

  addPlayer() {
    this.router.navigate(['/player/input'])
  }

  editPlayer(id: number) {
    this.router.navigate(['/player/input', id])
  }

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

import { Component, inject, OnInit } from '@angular/core';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { AsyncPipe } from '@angular/common';
import { BannerService, BannerType } from '../services/banner.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  authService = inject(AuthService);
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
    if (this.authService.adminLoggedIn()) {
      this.players$ = this.playerService.getPlayers();
    } else {
      this.players$ = this.playerService.getPlayers().pipe(
        map(players => players.filter(player => player.swisstourLicense))
      );
    }

  }

  getPlayer(id: number) {
    this.player$ = this.playerService.getPlayer(id);
  }

  deletePlayer(player: Player) {
    if (confirm(`Are you sure you want to delete the player ${player.firstname} ${player.lastname}?`)) {
      this.players$ = this.playerService.deletePlayer(player)
    }
  }

  ngOnInit(): void {
    this.getPlayers();
  }
}

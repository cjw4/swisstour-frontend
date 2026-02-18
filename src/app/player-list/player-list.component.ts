import { ChangeDetectorRef, Component, inject, OnInit, Signal, signal } from '@angular/core';
import { APP_SETTINGS, appSettings } from '../app.settings';
import { delay, filter, finalize, map, Observable, switchMap, tap, toArray } from 'rxjs';
import { PlayerDto } from '../api/models/player-dto';
import { PlayersService } from '../api/services/players.service';
import { AsyncPipe } from '@angular/common';
import { BannerService, BannerType } from '../services/banner.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalLoadingIndicatorComponent } from '../local-loading-indicator/local-loading-indicator.component';

@Component({
  selector: 'app-player-list',
  imports: [AsyncPipe, TranslateModule, LocalLoadingIndicatorComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
  providers: [{ provide: APP_SETTINGS, useValue: appSettings }],
})
export class PlayerListComponent implements OnInit {
  [x: string]: any;
  // inject services
  playersService = inject(PlayersService);
  bannerService = inject(BannerService);
  authService = inject(AuthService);
  router = inject(Router);
  translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  // variables
  players$: Observable<PlayerDto[]> | undefined;
  player$: Observable<PlayerDto> | undefined;
  searchTerm = signal('');
  loading = signal(false);

  updateSearchTerm(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm.set(inputElement.value);
    this.getPlayers()
  }

  addPlayer() {
    this.router.navigate(['/player/input']);
  }

  editPlayer(id: number | undefined) {
    this.router.navigate(['/player/input', id]);
  }

  getPlayers() {
    this.loading.set(true);
    if (this.authService.adminLoggedIn()) {
      this.players$ = this.playersService.getAllPlayers().pipe(
        map((arr) =>
          arr.sort((a, b) => {
            // Sort using a comparator that handles null/undefined values
            if (a.sdaNumber == null && b.sdaNumber == null) return 0; // Both are null/undefined, keep their order
            if (a.sdaNumber == null) return 1; // Place nulls at the bottom
            if (b.sdaNumber == null) return -1; // Place nulls at the bottom
            return a.sdaNumber - b.sdaNumber; // Regular ascending sort for non-null values
          })
        ),
        map((players) => this.filterPlayers(players)), // Filter players based on searchTerm
        finalize(() => this.loading.set(false))
      );
    } else {
      this.players$ = this.playersService.getAllPlayers().pipe(
        map((arr) => arr.sort((a, b) => (a.sdaNumber ?? 0) - (b.sdaNumber ?? 0))), // Sort by 'sdaNumber' in ascending order
        map((players) => players.filter((player) => player.swisstourLicense)),
        map((players) => this.filterPlayers(players)), // Filter players based on searchTerm
        finalize(() => this.loading.set(false))
      );
    }
  }

  // Helper method to filter players based on search term
  private filterPlayers(players: PlayerDto[]) {
    const term = this.searchTerm().toLowerCase();
    return players.filter(
      (player) =>
        player.firstname?.toLowerCase().includes(term) ||
        player.lastname?.toLowerCase().includes(term) ||
        (player.sdaNumber != null &&
          player.sdaNumber.toString().includes(term)) ||
        (player.pdgaNumber != null &&
          player.pdgaNumber.toString().includes(term))
    );
  }

  getPlayer(id: number) {
    this.player$ = this.playersService.getPlayer({ id });
  }

  deletePlayer(player: PlayerDto) {
    const confirmMessage = `${this.translateService.instant('playerList.deleteConfirm')} ${player.firstname} ${player.lastname}?`;
    if (confirm(confirmMessage)) {
      this.playersService.deletePlayer({ id: player.id! }).subscribe(() => {
        const message = this.translateService.instant('banners.playerDeleted');
        this.bannerService.updateBanner(message, BannerType.SUCCESS);
        this.getPlayers();
        this.cdr.detectChanges();
      });
    }
  }

  ngOnInit(): void {
    this.getPlayers();
  }
}

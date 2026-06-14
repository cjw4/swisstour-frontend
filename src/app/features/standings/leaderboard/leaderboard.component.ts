import { Component, inject, Signal, signal, input, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { StandingsService } from '../../../api/services/standings.service';
import { PlayersService } from '../../../api/services/players.service';
import { finalize, map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { StandingDto } from '../../../api/models/standing-dto';
import { PlayerDto } from '../../../api/models/player-dto';
import { TranslateModule } from '@ngx-translate/core';
import { LocalLoadingIndicatorComponent } from '../../../shared/components/local-loading-indicator/local-loading-indicator.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  imports: [AsyncPipe, CommonModule, TranslateModule, LocalLoadingIndicatorComponent, RouterLink],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
  category = input<string | undefined>();

  private activatedRoute = inject(ActivatedRoute);
  private standingsService = inject(StandingsService);
  private playersService = inject(PlayersService);

  standings$: Observable<StandingDto[]> | undefined;
  playersSignal: Signal<PlayerDto[]>;
  year = signal<number | undefined>(undefined);
  loading = signal(false);
  private loadingCount = 0;

  constructor() {
    this.playersSignal = toSignal(this.playersService.getAllPlayers(), { initialValue: [] });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.year.set(Number(params.get('year')));
    });

    effect(() => {
      const cat = this.category();
      const yr = this.year();
      if (cat && yr) {
        this.getLeaderboard();
      }
    });
  }

  private localLoadingOn() {
    this.loadingCount++;
    this.loading.set(true);
  }

  private localLoadingOff() {
    if (--this.loadingCount === 0) this.loading.set(false);
  }

  private getLeaderboard() {
    this.localLoadingOn();
    this.standings$ = this.standingsService.getStandings({ year: this.year()!, division: this.category()! }).pipe(
      map((standings) => standings.slice(0, 5)),
      finalize(() => this.localLoadingOff())
    );
  }

  findPlayer(playerId: number) {
    const players = this.playersSignal();
    return players.find((p: PlayerDto) => p.id === playerId);
  }
}

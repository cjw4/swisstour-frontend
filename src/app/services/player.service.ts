import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersUrl: string = inject(APP_SETTINGS).apiUrl + '/players'
  http = inject(HttpClient)

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.playersUrl);
  }
}

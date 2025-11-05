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

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(this.playersUrl + '/' + id);
  }

  addPlayer(player: any): Observable<any> {
    return this.http.post<Player>(this.playersUrl, player);
  }

  updatePlayer(player: any, id: number): Observable<any> {
    return this.http.put<Player>(this.playersUrl + '/' + id, player)
  }

  deletePlayer(player: Player) {
    const url = `${this.playersUrl}/${player.id}`;
    return this.http.delete(url);
  }
}

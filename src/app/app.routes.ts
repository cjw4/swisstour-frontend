import { Routes } from '@angular/router';
import { EventPageComponent } from './event-page/event-page.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { StandingsComponent } from './standings/standings.component';

export const routes: Routes = [
    {
      path:'',
      redirectTo: 'standings',
      pathMatch: 'full'
    },
    {
      path: 'events',
      component: EventPageComponent
    },
    {
      path: 'players',
      component: PlayerListComponent
    },
    {
      path: 'standings',
      component: StandingsComponent
    }
];

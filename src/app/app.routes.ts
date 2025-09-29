import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { PlayerListComponent } from './player-list/player-list.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'events',
        pathMatch: 'full'
    },
    {
        path: 'events',
        component: EventListComponent
    },
    {
        path: 'players',
        component: PlayerListComponent
    }
];

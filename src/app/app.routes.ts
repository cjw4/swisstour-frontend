import { Routes } from '@angular/router';
import { StandingsComponent } from './standings/standings.component';
import { PlayerInputComponent } from './player-input/player-input.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventInputComponent } from './event-input/event-input.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { appSettings } from './app.settings';
import { PlayerDetailsResolver } from './player-details/player-details.resolver';
import { FeedbackComponent } from './feedback/feedback.component';
import { FaqComponent } from './faq/faq.component';

export const routes: Routes = [
    {
      path:'',
      component: LandingPageComponent,
    },
    {
      path: 'events/:year',
      component: EventListComponent,
      canActivate: [authGuard]
    },
    {
      path: 'event/input',
      component: EventInputComponent,
      canActivate: [authGuard]
    },
    {
      path: 'event/input/:id',
      component: EventInputComponent,
      canActivate: [authGuard]
    },
    {
      path: 'players',
      component: PlayerListComponent
    },
    {
      path: 'player/input',
      component: PlayerInputComponent,
      canActivate: [authGuard]
    },
    {
      path: 'player/input/:id',
      component: PlayerInputComponent,
      canActivate: [authGuard]
    },
    {
      path: 'player/:id',
      component: PlayerDetailsComponent,
      resolve: {
        data: PlayerDetailsResolver
      }
    },
    {
      path: 'standings/:year/:category',
      component: StandingsComponent
    },
    {
      path: 'admin/login',
      component: LoginComponent
    },
    {
      path: 'feedback',
      component: FeedbackComponent
    },
    {
      path: 'faq',
      component: FaqComponent
    },
    {
      path: '**',
      redirectTo: 'standings/' + appSettings.currentYear,
      pathMatch: 'full',
    },
];

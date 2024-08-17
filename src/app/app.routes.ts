import {Routes} from '@angular/router';
import {FailedComponent} from './failed/failed.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {MsalGuard} from '@azure/msal-angular';
import {ConsultaComponent} from "./consulta/consulta.component";
import {RetornoComponent} from "./retorno/retorno.component";

export const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'consulta',
    component: ConsultaComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'retorno',
    component: RetornoComponent,
    canActivate: [MsalGuard]
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login-failed',
    component: FailedComponent
  }
];

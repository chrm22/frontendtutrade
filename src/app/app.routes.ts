import { Routes } from '@angular/router';
import {HomeComponent} from './componente/home/home.component';
import {UsuarioRegistroComponent} from './componente/usuario-registro/usuario-registro.component';
import {LoginComponent} from './componente/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'registro', component: UsuarioRegistroComponent },
  { path: 'login', component: LoginComponent },
];

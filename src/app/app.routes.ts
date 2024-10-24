import { Routes } from '@angular/router';
import {HomeComponent} from './componente/home/home.component';
import {UsuarioRegistroComponent} from './componente/usuario-registro/usuario-registro.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'registro', component: UsuarioRegistroComponent },
];

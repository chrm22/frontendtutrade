import { Routes } from '@angular/router';
import {HomeComponent} from './componente/home/home.component';
import {UsuarioRegistroComponent} from './componente/usuario-registro/usuario-registro.component';
import {LoginComponent} from './componente/login/login.component';
import {FeedComponent} from './componente/feed/feed.component';
import {AuthGuard} from './guards/auth.guard';
import {AuthRedirectGuard} from './guards/auth-redirect.guard';
import {DynamicLayoutComponent} from './componente/dynamic-layout/dynamic-layout.component';
import {ArticuloRegistroComponent} from './componente/articulo-registro/articulo-registro.component';
import {UsuarioPerfilComponent} from './componente/usuario-perfil/usuario-perfil.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthRedirectGuard] },
  { path: 'registro', component: UsuarioRegistroComponent, canActivate: [AuthRedirectGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthRedirectGuard] },

  {
    path: 'app',
    component: DynamicLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'feed', component: FeedComponent },
      { path: 'registrar-articulo', component: ArticuloRegistroComponent },
      { path: 'perfil', component: UsuarioPerfilComponent },
    ]
  },
];

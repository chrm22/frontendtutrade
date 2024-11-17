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
import {ArticuloDetalleComponent} from './componente/articulo-detalle/articulo-detalle.component';
import {MisArticulosComponent} from './componente/mis-articulos/mis-articulos.component';
import {TruequeRecibidasComponent} from './componente/trueque-recibidas/trueque-recibidas.component';
import {TruequeEnviadasComponent} from './componente/trueque-enviadas/trueque-enviadas.component';
import {TruequeDetalleComponent} from './componente/trueque-detalle/trueque-detalle.component';
import {MiPerfilComponent} from './componente/mi-perfil/mi-perfil.component';

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
      { path: 'perfil/:username', component: UsuarioPerfilComponent },
      { path: 'perfil', component: UsuarioPerfilComponent },
      { path: 'articulo/:id', component: ArticuloDetalleComponent },
      { path: 'mis-articulos', component: MisArticulosComponent },
      { path: 'propuestas/enviadas', component: TruequeEnviadasComponent },
      { path: 'propuestas/recibidas', component: TruequeRecibidasComponent },
      { path: 'propuestas/:id', component: TruequeDetalleComponent },
      { path: 'mi-perfil', component: MiPerfilComponent },
    ]
  },
];

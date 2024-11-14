import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Token} from '../model/token';
import {jwtDecode} from 'jwt-decode';
import {UsuarioService} from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/usuarios/login';  // URL de tu backend
  private usuarioService: UsuarioService = inject(UsuarioService);

  constructor(private http: HttpClient) { }

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    const decoded: any = jwtDecode(token);
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);
      return expirationDate < new Date();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password })
      .pipe(
        tap((data: Token) => {
          localStorage.setItem("jwtToken", data.jwtToken);
          localStorage.setItem("id", data.id.toString());
          localStorage.setItem("authorities", data.authorities);
        })
      );
  }

  logout() {
    localStorage.clear();
  }

  getId() {
    return localStorage.getItem("id");
  }

  getToken() {
    return localStorage.getItem("jwtToken");
  }

  getAuthorities() {
    return localStorage.getItem("authorities");
  }

  getUsuarioAutenticado(): Observable<any> {
    const id = localStorage.getItem("id");
    if (id) {
      return this.usuarioService.getById(Number(id));
    } else {
      throw new Error("No se encontró un id de usuario autenticado");
    }
  }
}

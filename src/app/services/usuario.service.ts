import {inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Usuario} from '../model/usuario';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = environment.apiUrl + "/usuarios";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Usuario[]>();

  constructor() { }

  list(): Observable<any> {
    return this.http.get<Usuario[]>(this.url);
  }
  insert(usuario: Usuario): Observable<any> {
    return this.http.post(this.url + "/register", usuario);
  }

  getById(id: number): Observable<any> {
    return this.http.get<Usuario>(`${this.url}/id/${id}`);
  }

  getByUsername(username: string): Observable<any> {
    return this.http.get<Usuario>(`${this.url}/username/${username}`);
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(): Observable<any> {
    return this.listaCambio.asObservable();
  }

  existeUsername(username: string): Observable<any> {
    return this.http.get(`${this.url}/existe/username/${username}`);
  }

  existeEmail(email: string): Observable<any> {
    return this.http.get(`${this.url}/existe/email/${email}`);
  }

  existeDni(dni: string): Observable<any> {
    return this.http.get(`${this.url}/existe/dni/${dni}`);
  }

  existeTelefono(telefono: string): Observable<any> {
    return this.http.get(`${this.url}/existe/telefono/${telefono}`);
  }
}

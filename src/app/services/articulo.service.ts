import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Articulo} from '../model/articulo';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  private url = environment.apiUrl + "/articulos";
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Articulo[]>();

  constructor() { }

  getById(id: number): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.url}/${id}`);
  }

  list(): Observable<any> {
    return this.http.get<Articulo[]>(this.url);
  }
  insert(articulo: Articulo): Observable<any> {
    return this.http.post(this.url, articulo);
  }
  setList(listaNueva: Articulo[]) {
    this.listaCambio.next(listaNueva);
  }

  listarMisArticulos(): Observable<any> {
    return this.http.get<Articulo[]>(environment.apiUrl + "/mis-articulos");
  }

  listarMisArticulosExceptoOfrecidosA(id: number): Observable<any> {
    return this.http.get<Articulo[]>(`${environment.apiUrl}/mis-articulos/except/${id}`);
  }

  getList(): Observable<any> {
    return this.listaCambio.asObservable();
  }
}

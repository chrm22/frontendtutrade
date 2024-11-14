import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Usuario} from '../model/usuario';
import {Pedido} from '../model/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private listaCambio = new Subject<Usuario[]>();

  constructor() { }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.url}/pedidos/${id}`);
  }

  crearPedido(pedido: Pedido, idArticulo: number): Observable<any> {
    return this.http.post(`${this.url}/articulos/${idArticulo}`, pedido);
  }

  getPedidosRecibidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url + "/pedidos/recibidos");
  }

  getPedidosRecibidosPorArticulo(idArticulo: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}/pedidos/recibidos/${idArticulo}`);
  }

  getPedidosRealizados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url + "/pedidos/realizados");
  }

  getPedidosRealizadosPorArticulo(idArticulo: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}/pedidos/realizados/${idArticulo}`);
  }


}

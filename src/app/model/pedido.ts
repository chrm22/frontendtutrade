import {Articulo} from './articulo';

export class Pedido {
  id: number;
  articulo: Articulo;
  articuloOfrecido: Articulo;
  fechaCreacion: Date;
  estado: string;

  articuloOfrecidoId: number;

  pedidoId: number;
  opcion: string;
  color: string;
}

import {Imagen} from './imagen';

export class Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  publico: boolean;
  etiquetas: string[] = [];
  imagenes: Imagen[] = [];
  estado: string;
}

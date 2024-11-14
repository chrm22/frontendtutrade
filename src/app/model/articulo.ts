import {Imagen} from './imagen';
import {Usuario} from './usuario';

export class Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  publico: boolean;
  etiquetas: string[] = [];
  imagenes: Imagen[] = [];
  estado: string;

  usuario: Usuario;
  username: string;
}

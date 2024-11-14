export class Usuario {
  id: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: Date = new Date();
  email: string;
  telefono: string;
  ciudad: string;
  pais: string;

  cantidadIntercambios: number;
  calificacionPromedio: number;

  localidad: string;
  nombreCompleto: string;
}

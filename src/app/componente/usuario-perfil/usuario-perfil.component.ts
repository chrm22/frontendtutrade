import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Articulo} from '../../model/articulo';
import {Usuario} from '../../model/usuario';
import {ArticuloService} from '../../services/articulo.service';
import {UploadImageService} from '../../services/upload-image.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UsuarioService} from '../../services/usuario.service';
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-usuario-perfil',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatCard,
    MatCardContent,
    MatCardImage,
    MatIcon,
    NgForOf,
    NgIf,
    RouterLink,
    NgStyle
  ],
  templateUrl: './usuario-perfil.component.html',
  styleUrl: './usuario-perfil.component.css'
})
export class UsuarioPerfilComponent {

  private authService: AuthService = inject(AuthService);

  usuario: Usuario;
  usuarioAutenticado: Usuario;
  articuloService: ArticuloService = inject(ArticuloService);
  usuarioService: UsuarioService = inject(UsuarioService);
  articulos: Articulo[];

  imagenService: UploadImageService = inject(UploadImageService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  userImage: string;
  placeholderImage: string = "assets/placeholder-image.svg";

  ngOnInit(): void {
    // Primero obtenemos el usuario autenticado
    this.authService.getUsuarioAutenticado().subscribe({
      next: (usuario) => {
        this.usuarioAutenticado = usuario;
        console.log('Usuario autenticado: ', this.usuarioAutenticado);

        // Ahora obtenemos el 'username' de la ruta
        const username = this.route.snapshot.paramMap.get('username');

        // Si no hay 'username', redirigimos a 'mi perfil'
        if (!username) {
          this.router.navigate(['/app/mi-perfil']);
          return;
        }

        // Si el username del usuario autenticado coincide con el de la ruta, redirigimos
        if (username === this.usuarioAutenticado.username) {
          this.router.navigate(['/app/mi-perfil']);
          return; // Salir si el usuario autenticado es el mismo
        }

        // Obtener el usuario por el 'username' de la ruta
        this.usuarioService.getByUsername(username).subscribe({
          next: (usuario) => {
            this.usuario = usuario;

            this.userImage = this.usuario.urlFotoPerfil || 'assets/user-picture.svg';
            console.log('Foto de perfil:', this.userImage);
          },
          error: (err) => {
            console.log('Error al obtener el usuario:', err);
          }
        });

        // Obtener artículos del usuario
        this.articuloService.listarPorUsuario(username).subscribe({
          next: (data) => {
            this.articulos = data;

            // Verificar cada artículo si tiene imagen, y validarla
            this.articulos.forEach(articulo => {
              switch (articulo.estado) {
                case 'intercambiado': {
                  articulo.color = 'green';
                  break;
                }
                case 'disponible': {
                  articulo.color = 'blue';
                  break;
                }
              }

              const imageUrl = articulo.imagenes?.[0]?.url;
              if (imageUrl) {
                this.imagenService.checkImageExistence(imageUrl).subscribe(exists => {
                  if (!exists) {
                    articulo.imagenes[0].url = this.placeholderImage;  // Usar un placeholder si la imagen no existe
                  }
                });
              } else {
                articulo.imagenes[0].url = this.placeholderImage;  // Si no hay imagen, usar el placeholder
              }
            });
          },
          error: (err) => {
            this.articulos = [];
            console.log("Artículos no encontrados", err);
          }
        });
      },
      error: (error) => {
        console.log('Error al obtener el usuario autenticado: ', error);
      }
    });
  }
}

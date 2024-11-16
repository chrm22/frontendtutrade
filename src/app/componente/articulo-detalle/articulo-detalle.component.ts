import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ArticuloService} from '../../services/articulo.service';
import {Articulo} from '../../model/articulo';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCard, MatCardHeader, MatCardModule} from '@angular/material/card';
import {UploadImageService} from '../../services/upload-image.service';
import {Usuario} from '../../model/usuario';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ArticuloSeleccionDialogComponent} from '../articulo-seleccion-dialog/articulo-seleccion-dialog.component';
import {Pedido} from '../../model/pedido';
import {PedidoService} from '../../services/pedido.service';
import {
  ArticuloConfirmacionDialogComponent
} from '../articulo-confirmacion-dialog/articulo-confirmacion-dialog.component';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-articulo-detalle',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatRadioButton,
    MatRadioGroup,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardModule,
    NgIf,
    RouterLink,
    MatSelect,
    FormsModule,
    MatOption,
    MatSelectModule,
    NgForOf
  ],
  templateUrl: './articulo-detalle.component.html',
  styleUrl: './articulo-detalle.component.css'
})
export class ArticuloDetalleComponent {

  visibilidad: boolean;
  selectedValue: string;

  estados = [
    {value: 'disponible', viewValue: 'Disponible'},
    {value: 'intercambiado', viewValue: 'Intercambiado'},
  ];

  private authService: AuthService = inject(AuthService);
  articulo: Articulo;

  dialog: MatDialog = inject(MatDialog);

  usuarioAutenticado: Usuario;
  articuloService: ArticuloService = inject(ArticuloService);
  pedidoService: PedidoService = inject(PedidoService);

  imagenService: UploadImageService = inject(UploadImageService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  articuloDisponible: boolean = true;
  placeholderImage: string = "assets/placeholder-image.svg"

  ngOnInit(): void {
    this.authService.getUsuarioAutenticado().subscribe({
      next: (usuario) => {
        this.usuarioAutenticado = usuario;
        console.log('Usuario autenticado: ', this.usuarioAutenticado);
      },
      error: (error) => {
        console.log('Error al obtener el usuario: ', error);
      }
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const articuloId = parseInt(id, 10);
      this.articuloService.getById(articuloId).subscribe({
        next: data => {
          this.articulo = data;

          if (this.esArticuloDelUsuario(this.articulo.usuario.id)) {
            this.selectedValue = this.articulo.estado;
            this.visibilidad = this.articulo.publico;
          }

          const imageUrl = this.articulo.imagenes?.[0]?.url;

          if (imageUrl) {
            this.imagenService.checkImageExistence(imageUrl).subscribe(exists => {
              if (!exists) {
                this.articulo.imagenes[0].url = this.placeholderImage;
              }
            });
          } else {
            this.articulo.imagenes[0].url = this.placeholderImage;
          }

          this.articuloDisponible = true;
        },
        error: err => {
          this.articuloDisponible = false;
          console.log("Artículo no disponible", err);
        }
      });
    }

  }

  abrirSeleccionArticuloDialog() {
    const articuloSolicitado = this.articulo; // Recuperar el artículo solicitado

    const dialogRef = this.dialog.open(ArticuloSeleccionDialogComponent, {
      data: {
        articuloSolicitado: articuloSolicitado
      }
    });

    dialogRef.afterClosed().subscribe(articuloSeleccionado => {
      if (articuloSeleccionado) {
        console.log("Artículo seleccionado");
        this.abrirConfirmarSolicitudDialog(articuloSeleccionado);
      }
      console.log("Artículo no seleccionado");
    });
  }

  abrirConfirmarSolicitudDialog(articuloOfrecido: any) {
    const articuloSolicitado = this.articulo; // Recuperar el artículo solicitado

    const dialogRef = this.dialog.open(ArticuloConfirmacionDialogComponent, {
      data: {
        articuloSolicitado: articuloSolicitado,
        articuloOfrecido: articuloOfrecido,
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        const pedido: Pedido = new Pedido();
        pedido.articuloOfrecidoId = articuloOfrecido.id;

        this.pedidoService.crearPedido(pedido, articuloSolicitado.id).subscribe({
          next: (data) => {
            alert("Tu solicitud de intercambio fue realizada con éxito.");
            console.log("Pedido creado exitosamente.", data);
            console.log("Artículo solicitado:", articuloSolicitado.id);
            console.log("Artículo solicitado:", articuloOfrecido.id);
          },
          error: (error) => {
            console.log("Error al generar el pedido: ", error);
          }
        });
      }
    });
  }

  editarArticulo() {
    if (this.articulo.estado === this.selectedValue &&
      this.articulo.publico === this.visibilidad) {
      alert("No se han registrado cambios");
      return;
    }

    const articuloTemp: Articulo = new Articulo();

    articuloTemp.articuloId = this.articulo.id;
    articuloTemp.nuevoEstado = this.selectedValue;
    articuloTemp.publico = this.visibilidad;

    this.articuloService.editarEstadoArticulo(articuloTemp).subscribe({
      next: (data) => {
        this.router.navigate(['/app/mis-articulos']);
        alert("Artículo editado exitosamente");
      },
      error: (error) => {
        console.log("Error al registro editado exitosamente", error);
      }
    })
  }

  protected esArticuloDelUsuario(id: number): boolean {
    return this.usuarioAutenticado.id === id;
  }
}


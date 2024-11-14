import {Component, Inject, inject} from '@angular/core';
import {Articulo} from '../../model/articulo';
import {PedidoService} from '../../services/pedido.service';
import {ArticuloService} from '../../services/articulo.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatList, MatListItem} from '@angular/material/list';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {MatRadioButton} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardAvatar, MatCardSmImage, MatCardTitle, MatCardTitleGroup} from '@angular/material/card';
import {UploadImageService} from '../../services/upload-image.service';

@Component({
  selector: 'app-articulo-seleccion-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatList,
    NgForOf,
    MatListItem,
    MatRadioButton,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatCard,
    MatCardAvatar,
    MatCardTitle,
    MatCardSmImage,
    NgOptimizedImage,
    MatCardTitleGroup
  ],
  templateUrl: './articulo-seleccion-dialog.component.html',
  styleUrl: './articulo-seleccion-dialog.component.css'
})
export class ArticuloSeleccionDialogComponent {
  misArticulos: Articulo[] = [];
  articuloSeleccionado: Articulo;
  articuloSolicitado: Articulo;

  imagenService: UploadImageService = inject(UploadImageService);
  articuloService: ArticuloService = inject(ArticuloService);
  pedidoService: PedidoService = inject(PedidoService);

  placeholderImage: string = "assets/placeholder-image.svg"
  // private dialogRef: MatDialogRef<ArticuloSeleccionDialogComponent> = inject(MatDialogRef)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ArticuloSeleccionDialogComponent>,
  ) { }

  ngOnInit() {

    console.log("Hola");
    this.articuloService.listarMisArticulosExceptoOfrecidosA(this.data.articuloSolicitado.id).subscribe({
      next: data => {
        this.misArticulos = data;

        console.log("Id art solicitado: ", this.data.articuloSolicitado.id);

        this.misArticulos.forEach(articulo => {
          const imageUrl = articulo.imagenes?.[0]?.url;

          if (imageUrl) {
            // Verificamos si la imagen existe
            this.imagenService.checkImageExistence(imageUrl).subscribe(exists => {
              if (!exists) {
                articulo.imagenes[0].url = this.placeholderImage;
              }
            });
          } else {
            articulo.imagenes[0].url = this.placeholderImage;
          }
        });
      },
      error: err => {
        // this.misArticulos = err;
        console.log('Error al obtener los artículos del usuario', err);
      }
    })
  }

  seleccionarArticulo(id: number) {
    this.articuloService.getById(id).subscribe(data => {
      this.articuloSeleccionado = data;
      this.dialogRef.close(this.articuloSeleccionado);
    })

    console.log("Seleccionar de Selección", id);
  }

  cancelar() {
    this.dialogRef.close(); // Cierra el diálogo sin seleccionar un artículo
    console.log("Cancelar de Selección");
  }

}

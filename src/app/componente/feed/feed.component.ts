import {Component, inject} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ArticuloService} from '../../services/articulo.service';
import {Articulo} from '../../model/articulo';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardModule
} from '@angular/material/card';
import {UploadImageService} from '../../services/upload-image.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    NgOptimizedImage,
    NgForOf,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardImage,
    MatCardActions,
    MatButton,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {

  protected articulos: Articulo[];
  private articuloService: ArticuloService = inject(ArticuloService);
  private imagenService: UploadImageService = inject(UploadImageService);
  placeholderImage: string = "assets/placeholder-image.svg"

  constructor() {}

  ngOnInit(): void {
    this.articuloService.list().subscribe(data => {
      this.articulos = data;

      this.articulos.forEach(articulo => {
        const imageUrl = articulo.imagenes?.[0]?.url;

        if (imageUrl) {
          // Verificamos si la imagen existe
          this.imagenService.checkImageExistence(imageUrl).subscribe(exists => {
            if (!exists) {
              articulo.imagenes[0].url = this.placeholderImage;  // Asignamos el placeholder si la imagen no existe
            }
          });
        } else {
          // Si no hay URL, asignamos directamente el placeholder
          articulo.imagenes[0].url = this.placeholderImage;
        }
      });
    });



  }
}

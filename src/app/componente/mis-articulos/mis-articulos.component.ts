import {Component, inject} from '@angular/core';
import {
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {RouterLink} from '@angular/router';
import {Articulo} from '../../model/articulo';
import {ArticuloService} from '../../services/articulo.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-mis-articulos',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
    NgForOf,
    NgOptimizedImage,
    RouterLink,
    NgStyle,
    MatIcon,
    NgIf
  ],
  templateUrl: './mis-articulos.component.html',
  styleUrl: './mis-articulos.component.css'
})
export class MisArticulosComponent {
    misArticulos: Articulo[];
    articuloService: ArticuloService = inject(ArticuloService);

    ngOnInit(): void {
      this.articuloService.listarMisArticulos().subscribe(data => {
        this.misArticulos = data;

        this.misArticulos.forEach(articulo => {
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
        })

      })
    }
}

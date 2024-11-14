import {Component, inject} from '@angular/core';
import {
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from '@angular/router';
import {Articulo} from '../../model/articulo';
import {ArticuloService} from '../../services/articulo.service';

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
    RouterLink
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

      })
    }
}

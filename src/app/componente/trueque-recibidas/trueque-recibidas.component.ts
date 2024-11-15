import {Component, inject} from '@angular/core';
import {Pedido} from '../../model/pedido';
import {ArticuloService} from '../../services/articulo.service';
import {PedidoService} from '../../services/pedido.service';
import {MatCard, MatCardContent, MatCardSmImage} from '@angular/material/card';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-trueque-recibidas',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardSmImage,
    NgForOf,
    NgOptimizedImage,
    NgIf,
    RouterLink
  ],
  templateUrl: './trueque-recibidas.component.html',
  styleUrl: './trueque-recibidas.component.css'
})
export class TruequeRecibidasComponent {
  misRecibidas: Pedido[];
  articuloService: ArticuloService = inject(ArticuloService);
  pedidoService: PedidoService = inject(PedidoService);

  constructor() {
  }

  ngOnInit(): void {
    this.pedidoService.getPedidosRecibidos().subscribe({
      next: data => {
        this.misRecibidas = data;

        this.misRecibidas.forEach(pedido => {

          this.articuloService.getById(pedido.articulo.id).subscribe({
            next: data => {
              pedido.articulo = data;
            },
            error: error => {
              console.log(error);
            }
          })

          this.articuloService.getById(pedido.articuloOfrecido.id).subscribe({
            next: data => {
              pedido.articuloOfrecido = data;
            },
            error: error => {
              console.log(error);
            }
          })

        })
      },
      error: error => {
        console.log(error);
      }
    })
  }
}

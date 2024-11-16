import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardImage, MatCardSmImage} from '@angular/material/card';
import {NgForOf, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {RouterLink} from '@angular/router';
import {PedidoService} from '../../services/pedido.service';
import {ArticuloService} from '../../services/articulo.service';
import {Pedido} from '../../model/pedido';

@Component({
  selector: 'app-trueque-enviadas',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardImage,
    NgForOf,
    NgOptimizedImage,
    RouterLink,
    MatCardSmImage,
    NgIf,
    NgStyle
  ],
  templateUrl: './trueque-enviadas.component.html',
  styleUrl: './trueque-enviadas.component.css'
})
export class TruequeEnviadasComponent {
  misEnviadas: Pedido[];
  articuloService: ArticuloService = inject(ArticuloService);
  pedidoService: PedidoService = inject(PedidoService);

  constructor() {
  }

  ngOnInit(): void {
    this.pedidoService.getPedidosRealizados().subscribe({
      next: data => {
        this.misEnviadas = data;

        this.misEnviadas.forEach(pedido => {

          switch (pedido.estado) {
            case 'aceptado': {
              pedido.color = 'green';
              break;
            }
            case 'rechazado': {
              pedido.color = 'red';
              break;
            }
            case 'pendiente': {
              pedido.color = 'blue';
              break;
            }
          }

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

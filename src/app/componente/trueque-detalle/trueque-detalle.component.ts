import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Articulo} from '../../model/articulo';
import {ArticuloService} from '../../services/articulo.service';
import {PedidoService} from '../../services/pedido.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Pedido} from '../../model/pedido';
import {Usuario} from '../../model/usuario';
import {AuthService} from '../../services/auth.service';
import {TruequeConfirmacionDialogComponent} from '../trueque-confirmacion-dialog/trueque-confirmacion-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-trueque-detalle',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './trueque-detalle.component.html',
  styleUrl: './trueque-detalle.component.css'
})
export class TruequeDetalleComponent {
  pedido: Pedido;
  articuloSolicitado: Articulo;
  articuloOfrecido: Articulo;
  usuarioAutenticado: Usuario;

  articuloService: ArticuloService = inject(ArticuloService);
  pedidoService: PedidoService = inject(PedidoService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  dialog: MatDialog = inject(MatDialog);
  route: ActivatedRoute = inject(ActivatedRoute);

  pedidoDisponible: boolean = true;

  ngOnInit(): void {

    this.authService.getUsuarioAutenticado().subscribe({
      next: (usuario) => {
        this.usuarioAutenticado = usuario;
      },
      error: (error) => {
        console.log('Error al obtener el usuario: ', error);
      }
    })

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const pedidoId = parseInt(id, 10);
      this.pedidoService.getById(pedidoId).subscribe({
        next: data => {
          this.pedido = data;

          this.articuloService.getById(this.pedido.articulo.id).subscribe({
            next: data => {
              this.articuloSolicitado = data;
            },
            error: error => {
              console.log(error);
            }
          })

          this.articuloService.getById(this.pedido.articuloOfrecido.id).subscribe({
            next: data => {
              this.articuloOfrecido = data;
            },
            error: error => {
              console.log(error);
            }
          })

          this.pedidoDisponible = true;

        },
        error: err => {
          this.pedidoDisponible = false;
          console.log("El pedido no está disponible.", err);
        }
      });
    }
  }

  abrirConfirmacionAccion(opcion: string) {
    const dialogRef = this.dialog.open(TruequeConfirmacionDialogComponent, {
      data: {
        pedidoId: this.pedido.id,
        articuloSolicitado: this.articuloSolicitado,
        articuloOfrecido: this.articuloOfrecido,
        opcion: opcion
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (accionConfirmada) => {
        if (accionConfirmada) {
          const pedidoTemp: Pedido = new Pedido();
          pedidoTemp.pedidoId = this.pedido.id;
          pedidoTemp.opcion = opcion;

          console.log(pedidoTemp);

          if (this.esPedidoRecibido()) {
            this.pedidoService.aceptarRechazarPedido(pedidoTemp).subscribe({
              next: data => {
                this.router.navigate(['/app/propuestas/recibidas'])
                alert("Pedido " + opcion.replace(/r$/, 'do') + " con éxito");
                console.log("Pedido " + opcion.replace(/r$/, 'do') + " con éxito", data);
              },
              error: error => {
                console.log(error);
              }
            })
          } else if (this.esPedidoEnviado()) {
            this.pedidoService.cancelarPedido(pedidoTemp).subscribe({
              next: data => {
                this.router.navigate(['/app/propuestas/enviadas'])
                alert("Pedido cancelado con éxito");
                console.log("Pedido cancelado con éxito", data);
              },
              error: error => {
                console.log(error);
              }
            })
          }
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  protected esArticuloDelUsuario(id: number): boolean {
    return this.usuarioAutenticado.id === id;
  }

  protected esPedidoEnviado(): boolean {
    return this.articuloOfrecido.usuario.id === this.usuarioAutenticado.id;
  }

  protected esPedidoRecibido(): boolean {
    return this.articuloSolicitado.usuario.id === this.usuarioAutenticado.id
  }


}

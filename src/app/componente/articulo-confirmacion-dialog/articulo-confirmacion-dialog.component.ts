import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-articulo-confirmacion-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './articulo-confirmacion-dialog.component.html',
  styleUrl: './articulo-confirmacion-dialog.component.css'
})
export class ArticuloConfirmacionDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibimos los artículos como datos
    private dialogRef: MatDialogRef<ArticuloConfirmacionDialogComponent>,
  ) { }

  confirmar() {
    this.dialogRef.close(true); // Si el usuario confirma
    console.log("Confirmar de Confirmación");
  }

  cancelar() {
    this.dialogRef.close(false); // Si el usuario cancela
    console.log("Cancelar de Confirmación");
  }
}

import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";

@Component({
  selector: 'app-trueque-confirmacion-dialog',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle
    ],
  templateUrl: './trueque-confirmacion-dialog.component.html',
  styleUrl: './trueque-confirmacion-dialog.component.css'
})
export class TruequeConfirmacionDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibimos los artículos como datos
    private dialogRef: MatDialogRef<TruequeConfirmacionDialogComponent>,
  ) { }

  confirmar() {
    this.dialogRef.close(true); // Si el usuario confirma
    console.log("Envío de solicitud confirmado");
  }

  cancelar() {
    this.dialogRef.close(false); // Si el usuario cancela
    console.log("Envío de solicitud cancelado");
  }
}

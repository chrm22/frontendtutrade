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
  selector: 'app-eliminar-confirmacion-dialog',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle
    ],
  templateUrl: './eliminar-confirmacion-dialog.component.html',
  styleUrl: './eliminar-confirmacion-dialog.component.css'
})
export class EliminarConfirmacionDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibimos los artículos como datos
    private dialogRef: MatDialogRef<EliminarConfirmacionDialogComponent>,
  ) { }

  confirmar() {
    this.dialogRef.close(true); // Si el usuario confirma
    console.log("Eliminación confirmada");
  }

  cancelar() {
    this.dialogRef.close(false); // Si el usuario cancela
    console.log("Elimiminación cancelada");
  }

}

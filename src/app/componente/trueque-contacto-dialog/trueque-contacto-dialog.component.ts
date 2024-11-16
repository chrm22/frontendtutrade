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
  selector: 'app-trueque-contacto-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './trueque-contacto-dialog.component.html',
  styleUrl: './trueque-contacto-dialog.component.css'
})
export class TruequeContactoDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibimos los artículos como datos
    private dialogRef: MatDialogRef<TruequeContactoDialogComponent>,
  ) { }

  close() {
    this.dialogRef.close();
  }
}

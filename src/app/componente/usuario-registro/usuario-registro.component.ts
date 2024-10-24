import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {UsuarioService} from '../../services/usuario.service';
import {Router} from '@angular/router';
import {Usuario} from '../../model/usuario';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-usuario-registro',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatCardContent,
    MatLabel,
    MatHint,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButton,
    MatIcon
  ],
  templateUrl: './usuario-registro.component.html',
  styleUrl: './usuario-registro.component.css'
})
export class UsuarioRegistroComponent {
  registroForm: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  usuarioService: UsuarioService = inject(UsuarioService);
  router: Router = inject(Router);
  letraPattern: string = '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$';
  hide = true;

  constructor() {
    this.registroForm = this.fb.group({
      id: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(8)]],
      nombre: ['', [Validators.required, Validators.pattern(this.letraPattern)]],
      apellido: ['', [Validators.required, Validators.pattern(this.letraPattern)]],
      dni: ['', [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]{9}$")]],
      ciudad: ['', [Validators.required, Validators.pattern(this.letraPattern)]],
      pais: ['', [Validators.required, Validators.pattern(this.letraPattern)]],
     })
  }

  onSubmit() {
    console.log("Ejecutando onSubmit")
    if (this.registroForm.valid) {
      const usuario: Usuario = new Usuario();
      usuario.username = this.registroForm.value.username;
      usuario.password = this.registroForm.value.password;
      usuario.nombre = this.registroForm.value.nombre;
      usuario.apellido = this.registroForm.value.apellido;
      usuario.dni = this.registroForm.value.dni;
      usuario.fechaNacimiento = this.registroForm.value.fechaNacimiento;
      usuario.email = this.registroForm.value.email;
      usuario.telefono = this.registroForm.value.telefono;
      usuario.ciudad = this.registroForm.value.ciudad;
      usuario.pais = this.registroForm.value.pais;

      console.log("Usuario a registrar: ", usuario)

      this.usuarioService.insert(usuario).subscribe((): void => {
        this.usuarioService.list().subscribe(data => {
          this.usuarioService.setList(data)
        })
      })
    } else {
      console.log("Formulario no válido")
    }
  }
}

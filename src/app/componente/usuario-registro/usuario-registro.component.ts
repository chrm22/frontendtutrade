import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {UsuarioService} from '../../services/usuario.service';
import {Router} from '@angular/router';
import {Usuario} from '../../model/usuario';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {catchError, map, Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UploadImageService} from '../../services/upload-image.service';

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
    MatIcon,
    NgIf,
    NgOptimizedImage,
  ],
  templateUrl: './usuario-registro.component.html',
  styleUrl: './usuario-registro.component.css'
})
export class UsuarioRegistroComponent {
  registroForm: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  usuarioService: UsuarioService = inject(UsuarioService);
  uploadService: UploadImageService = inject(UploadImageService);
  router: Router = inject(Router);
  letraPattern: string = '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$';
  hide = true;

  imageUrl: string | ArrayBuffer | null | undefined;
  defaultImageUrl: string = "assets/user-picture.svg";

  file: File | undefined;

  constructor() {
    this.registroForm = this.fb.group({
      id: [''],
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]{4,16}$")], [this.usernameDisponible.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      nombre: ['', [Validators.required, Validators.pattern(this.letraPattern)]],
      apellido: ['', [Validators.required, Validators.pattern(this.letraPattern)]],
      dni: ['', [Validators.required, Validators.pattern("^[0-9]{8}$")], [this.dniDisponible.bind(this)]],
      fechaNacimiento: ['',
        [
          Validators.required,
          (control: { value: string | number | Date; }) => {
            const fechaIngresada = new Date(control.value);
            const fechaHoy = new Date();
            fechaHoy.setHours(0, 0, 0, 0); // Aseguramos que solo se compare la fecha sin la hora
            if (fechaIngresada > fechaHoy) {
              return { fechaFutura: true };
            }
            return null;
          },
          (control: { value: string | number | Date; }) => {
            const fechaIngresada = new Date(control.value);
            const fechaHoy = new Date();
            fechaHoy.setHours(0, 0, 0, 0);
            const fechaLimite = new Date(fechaHoy);
            fechaLimite.setFullYear(fechaHoy.getFullYear() - 18);
            if (fechaIngresada > fechaLimite) {
              return { menorDe18: true };
            }
            return null;
          }
        ]],
      email: ['', [Validators.required, Validators.email], [this.emailDisponible.bind(this)]],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]{9}$")], [this.telefonoDisponible.bind(this)]],
      ciudad: ['', [Validators.required, Validators.pattern(this.letraPattern)]],
      pais: ['', [Validators.required, Validators.pattern(this.letraPattern)]],
     })
  }

  onSubmit() {
    console.log("Ejecutando onSubmit");

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

      if (this.file) {
        const data = new FormData();
        data.append('file', this.file);
        data.append('upload_preset', environment.CLOUDINARY_UPLOAD_PRESET);
        data.append('cloud_name', environment.CLOUDINARY_CLOUD_NAME);

        this.uploadService.uploadImg(data).subscribe({
          next: (response) => {
            console.log('Subida de imagen exitosa', response);
            usuario.urlFotoPerfil = response.secure_url;

            this.registrarUsuario(usuario);
          },
          error: (error) => {
            console.error('Error en la subida de imagen', error);
            this.registrarUsuario(usuario);
          }
        });
      } else {
        this.registrarUsuario(usuario);
      }
    } else {
      console.error("Formulario no válido");
    }
  }

  registrarUsuario(usuario: Usuario) {
    console.log("Usuario a registrar:", usuario);

    this.usuarioService.insert(usuario).subscribe({
      next: (data) => {
        console.log("Usuario registrado exitosamente", data);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log("Error al registrar usuario", err);
      }
    });
  }

  usernameDisponible(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    if (!control.value) {
      return of(null);
    }

    return this.usuarioService.existeUsername(control.value).pipe(
      map(response => {
        return null;
      }),
      catchError(error => {
        if (error.status === 409) {
          return of({ usernameYaExiste: true });
        }
        return of(null);
      })
    );
  }

  emailDisponible(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    if (!control.value) {
      return of(null);
    }

    return this.usuarioService.existeEmail(control.value).pipe(
      map(response => {
        return null;
      }),
      catchError(error => {
        if (error.status === 409) {
          return of({ emailYaExiste: true });
        }
        return of(null);
      })
    );
  }

  telefonoDisponible(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    if (!control.value) {
      return of(null);
    }

    return this.usuarioService.existeTelefono(control.value).pipe(
      map(response => {
        return null;
      }),
      catchError(error => {
        if (error.status === 409) {
          return of({ telefonoYaExiste: true });
        }
        return of(null);
      })
    );
  }

  dniDisponible(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    if (!control.value) {
      return of(null);
    }

    return this.usuarioService.existeDni(control.value).pipe(
      map(response => {
        return null;
      }),
      catchError(error => {
        if (error.status === 409) {
          return of({ dniYaExiste: true });
        }
        return of(null);
      })
    );
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    this.file = fileInput.files?.[0];

    if (this.file != undefined) {
      if (!(this.file.name.endsWith(".jpg") || this.file.name.endsWith(".jpeg") || this.file.name.endsWith(".png") || this.file.name.endsWith(".webp"))) {
        console.error("Formato de imagen subida no permitido.")
        return;
      }
    }

    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;
      };
      reader.readAsDataURL(this.file);
    }
  }
}

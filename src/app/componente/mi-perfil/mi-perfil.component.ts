import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Usuario} from '../../model/usuario';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment';
import {UploadImageService} from '../../services/upload-image.service';
import {UsuarioService} from '../../services/usuario.service';
import {Router} from '@angular/router';
import {
  EliminarConfirmacionDialogComponent
} from '../eliminar-confirmacion-dialog/eliminar-confirmacion-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatFormField,
    MatLabel,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    MatInput,
    ReactiveFormsModule,
    MatError
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {
  authService: AuthService = inject(AuthService);
  uploadService: UploadImageService = inject(UploadImageService);
  usuarioService: UsuarioService = inject(UsuarioService);
  usuario: Usuario;
  datosForm: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  letraPattern: string = '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$';
  dialog: MatDialog = inject(MatDialog);

  imageUrl: string;
  file: File | undefined;

  constructor() {
  }

  ngOnInit(): void {
    this.authService.getUsuarioAutenticado().subscribe({
      next: data => {
        this.usuario = data;

        this.imageUrl = this.usuario.urlFotoPerfil || 'assets/user-picture.svg'

        this.datosForm = this.fb.group({
          nombre: [this.usuario.nombre, Validators.pattern(this.letraPattern)],
          apellido: [this.usuario.apellido, Validators.pattern(this.letraPattern)],
          telefono: [this.usuario.telefono, Validators.pattern("^[0-9]{9}$")],
          email: [this.usuario.email, Validators.email],
        })
      },
      error: (error) => {
        console.log('Error al obtener el usuario: ', error);
      }
    })
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
        this.imageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.file); // Convierte la imagen a una URL en base64
    }
  }

  onSubmit() {

    if (this.datosForm.valid) {
      const usuario: Usuario = new Usuario();

      usuario.username = this.usuario.username;
      usuario.nombre = this.datosForm.value.nombre ? this.datosForm.value.nombre : this.usuario.nombre;
      usuario.apellido = this.datosForm.value.apellido ? this.datosForm.value.apellido : this.usuario.apellido;
      usuario.email = this.datosForm.value.email ? this.datosForm.value.email : this.usuario.email;
      usuario.telefono = this.datosForm.value.telefono ? this.datosForm.value.telefono : this.usuario.telefono;

      usuario.dni = this.usuario.dni;
      usuario.fechaNacimiento = this.usuario.fechaNacimiento;
      usuario.ciudad = this.usuario.ciudad;
      usuario.pais = this.usuario.pais;

      if (this.file) {
        const data = new FormData();
        data.append('file', this.file);
        data.append('upload_preset', environment.CLOUDINARY_UPLOAD_PRESET);
        data.append('cloud_name', environment.CLOUDINARY_CLOUD_NAME);

        this.uploadService.uploadImg(data).subscribe({
          next: (response) => {
            console.log('Subida de imagen exitosa', response);
            usuario.urlFotoPerfil = response.secure_url;

            this.editarUsuario(usuario);
          },
          error: (error) => {
            console.error('Error en la subida de imagen', error);
            this.editarUsuario(usuario);
          }
        });
      } else {
        usuario.urlFotoPerfil = this.usuario.urlFotoPerfil;
        this.editarUsuario(usuario);
      }
    } else {
      console.error("Formulario no válido");
    }
  }


  editarUsuario(usuario: Usuario) {
    console.log("Usuario a editar:", usuario);

    this.usuarioService.editarUsuario(usuario).subscribe({
      next: (data) => {
        console.log("Usuario editado exitosamente", data);
        alert("Usuario editado exitosamente")
        this.router.navigate(['/app/feed']);
      },
      error: (err) => {
        console.log("Error al editar usuario", err);
      }
    });
  }

  eliminarUsuario() {
    console.log("Usuario a eliminar:", this.usuario);

    const dialogRef = this.dialog.open(EliminarConfirmacionDialogComponent, {
      data: {
        tipo: "usuario"
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (accionConfirmada) => {
        if (accionConfirmada) {

          console.log("Se eliminará el usuario.");

          this.usuarioService.eliminarUsuario(this.usuario).subscribe({
            next: (data) => {
              console.log(data);
              alert("El usuario se eliminó exitosamente");
              this.authService.logout();
              this.router.navigate(['/']);
            }
          });
        }
      },
      error: err => {
        console.log(err);
      }
    });



  }
}

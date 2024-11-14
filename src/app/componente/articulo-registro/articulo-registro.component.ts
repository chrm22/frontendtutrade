import {Component, inject, ViewEncapsulation} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {CloudinaryModule} from '@cloudinary/ng';
import {environment} from '../../../environments/environment';
import {UploadImageService} from '../../services/upload-image.service';
import {ArticuloService} from '../../services/articulo.service';
import {Articulo} from '../../model/articulo';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {Imagen} from '../../model/imagen';

@Component({
  selector: 'app-articulo-registro',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    CloudinaryModule,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
  ],
  templateUrl: './articulo-registro.component.html',
  styleUrl: './articulo-registro.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ArticuloRegistroComponent {
  articuloService: ArticuloService = inject(ArticuloService);
  datosForm: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  uploadService: UploadImageService = inject(UploadImageService);
  imageUrl: string | ArrayBuffer | null | undefined;
  defaultImageUrl: string = "assets/placeholder-image.svg";

  file: File | undefined;

  constructor() {
    this.datosForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      publico: ['', Validators.required],
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
        this.imageUrl = e.target?.result;
      };
      reader.readAsDataURL(this.file); // Convierte la imagen a una URL en base64
    }
  }

  onSubmit() {
    if (this.datosForm.invalid) {
      console.error('Formulario inválido')
      return;
    }

    if (this.file == undefined) {
      console.error('Undefined image');
      return;
    }

    const data = new FormData();

    data.append('file', this.file);
    data.append('upload_preset', environment.CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', environment.CLOUDINARY_CLOUD_NAME);

    this.uploadService.uploadImg(data).subscribe({
      next: (response) => {
        console.log('Subida de imagen exitosa');
        console.log(response);

        this.imageUrl = response.secure_url;

        const imagen = new Imagen();
        imagen.nroImagen = 1;
        imagen.url = response.secure_url;
        // imagen.descripcion = 'test';
        // faltan etiquetas
        // falta descripción de la imagen

        const articulo = new Articulo();
        articulo.nombre = this.datosForm.value.nombre;
        articulo.descripcion = this.datosForm.value.descripcion;
        articulo.publico = this.datosForm.value.publico;
        articulo.imagenes = [imagen];
        articulo.etiquetas = [];

        this.articuloService.insert(articulo).subscribe({
          next: (res) => {
            console.log('Artículo registrado:', res);
            alert('Subida de imagen y registro de artículo exitoso');

            this.router.navigate(['/app/feed']);

          },
          error: (error) => {
            console.error('Error al registrar el artículo:', error);
          }
        });

      },
      error: (error) => {
        console.error('Error en la subida de imagen');
        console.error(error);
        return;
      }
    })
  }
}

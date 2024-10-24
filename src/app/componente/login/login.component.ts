import {Component, inject} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  username: string;
  password: string;
  hide = true;

  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        // Redirigir al usuario después del login
        // this.router.navigate(['/dashboard']);
        console.log('Login successful');
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const loginData = this.loginForm.value;
  //
  //     // Enviar la solicitud POST al backend con las credenciales
  //     this.http.post<any>('http://localhost:8080/api/usuarios/login', loginData)
  //       .subscribe({
  //         next: (response) => {
  //           // Supongamos que el backend devuelve el JWT en un campo 'token'
  //           const token = response.token;
  //
  //           // Guardar el token en localStorage para mantener la sesión
  //           localStorage.setItem('jwt', token);
  //
  //           // Redirigir al usuario a la página principal o dashboard
  //           this.router.navigate(['/dashboard']);
  //         },
  //         error: (error) => {
  //           console.error('Error en el inicio de sesión', error);
  //           // Puedes mostrar un mensaje de error en el UI si lo deseas
  //         }
  //       });
  //   } else {
  //     console.log('Formulario no válido');
  //   }
  // }
}

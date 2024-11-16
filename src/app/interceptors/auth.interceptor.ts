import {inject, Injectable} from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService: AuthService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor ejecutado');
    const token = this.authService.getToken();

    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/' + environment.CLOUDINARY_CLOUD_NAME + '/image/upload'

    const excludedUrls = [
      '/api/usuarios/register',
      '/api/usuarios/login',
      '/api/usuarios/existe',
      cloudinaryUrl
    ];

    if (excludedUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    if (token && !this.authService.isTokenExpired(token)) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Token insertado de manera correcta');
      console.log(token);
      return next.handle(cloned);
    } else {
      console.error('Token inválido o caducado');
      return next.handle(req);
    }
  }
}

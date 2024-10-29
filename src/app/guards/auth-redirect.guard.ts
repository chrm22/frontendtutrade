import {inject, Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectGuard implements CanActivate {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      this.router.navigate(['/app/feed']);
      return false;
    }
    return true;
  }
}

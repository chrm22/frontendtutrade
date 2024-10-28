import {Component, inject, ViewEncapsulation} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatToolbar,
    MatAnchor,
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './dynamic-layout.component.html',
  styleUrl: './dynamic-layout.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DynamicLayoutComponent {
  private authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  constructor() {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatIcon,
    MatIconButton,
    MatToolbar,
    MatAnchor
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

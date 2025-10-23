import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss',
})
export class MenuLateralComponent {
  constructor(private router: Router) {}
  navDashboard() {
    this.router.navigate(['/dashboard']);
  }
  navListaUsuarios() {
    this.router.navigate(['/listaUsuarios']);
  }
  navModalDocumento() {
    this.router.navigate(['/graficos']);
  }
  navModalCartorio() {
    this.router.navigate(['/Perfil']);
  }
  navLogOut() {
    this.router.navigate(['/splashScreen']);
  }
}

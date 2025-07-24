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
    this.router.navigate(['/home']);
  }
  navListaUsuarios() {
    this.router.navigate(['/listaUsuarios']);
  }
  navGraficos() {
    this.router.navigate(['/graficos']);
  }
  navPerfil() {
    this.router.navigate(['/Perfil']);
  }
  navConfig() {
    this.router.navigate(['/config']);
  }
  navLogOut() {
    this.router.navigate(['/splashScreen']);
  }
}

import { Component } from '@angular/core';
import { ListaUsuariosContentComponent } from '../../components/lista-usuarios-content/lista-usuarios-content.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    ListaUsuariosContentComponent,
    MenuLateralComponent,
    MenuLateralComponent,
    HeaderComponent,
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss',
})
export class ListaUsuariosComponent {}

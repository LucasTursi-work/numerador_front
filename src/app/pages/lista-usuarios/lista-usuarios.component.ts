import { Component } from '@angular/core';
import { ListaUsuariosContentComponent } from '../../components/lista-usuarios-content/lista-usuarios-content.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [ListaUsuariosContentComponent],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss',
})
export class ListaUsuariosComponent {}

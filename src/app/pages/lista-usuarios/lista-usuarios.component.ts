import { Component } from '@angular/core';
import { TabelaUsuariosComponent } from '../../components/tabela-usuarios/tabela-usuarios.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [TabelaUsuariosComponent],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss',
})
export class ListaUsuariosComponent {}

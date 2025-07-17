import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BuscarUsuariosParams,
  FiltroUsuarios,
} from '../../shared/dtos/request/usuario-params.dto';
import { StatusUsuario, PerfilUsuario } from '../../shared/enums/user-enums';

@Component({
  selector: 'app-filtros-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtros-usuarios.component.html',
  styleUrl: './filtros-usuarios.component.scss',
})
export class FiltrosUsuariosComponent {
  nome: string = '';
  cpf: string = '';
  status: StatusUsuario | null = null;
  perfil: PerfilUsuario | null = null;

  @Output() filtrosAplicados = new EventEmitter<FiltroUsuarios>();

  aplicarFiltros(): void {
    this.filtrosAplicados.emit({
      nome: this.nome || undefined,
      cpf: this.cpf || undefined,
      status: this.status || undefined,
      perfil: this.perfil || undefined,
    });
  }

  limparFiltros(): void {
    this.nome = '';
    this.cpf = '';
    this.status = null;
    this.perfil = null;
    this.aplicarFiltros();
  }

  perfilOptions = Object.values(PerfilUsuario);
  statusOptions = Object.values(StatusUsuario);
}

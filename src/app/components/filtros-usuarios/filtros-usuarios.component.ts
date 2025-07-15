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
  perfil: PerfilUsuario | undefined = undefined;
  PerfilUsuario = PerfilUsuario;
  cpf: string = '';

  @Output() filtrosMudaram = new EventEmitter<FiltroUsuarios>();

  aplicarFiltro() {
    this.filtrosMudaram.emit({
      nome: this.nome,
      cpf: this.cpf,
      perfil: this.perfil, // já é do tipo correto
      //  status: this.status, // (futuro campo também como enum)
    });
  }
}

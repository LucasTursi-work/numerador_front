import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { UsuarioService } from '../../modules/user/services/user.service';
import {
  UsuariosPaginadosResponse,
  UsuarioResponseDTO,
} from '../../shared/dtos/response/usuario-response.dto';
import { PerfilUsuario, StatusUsuario } from '../../shared/enums/user-enums';
import { BuscarUsuariosParams } from '../../shared/dtos/request/usuario-params.dto';
import { CpfPipe } from '../../shared/pipes/cpf.pipe';
import { CeilPipe } from '../../shared/pipes/ceil.pipe';

@Component({
  selector: 'app-tabela-usuarios',
  standalone: true,
  imports: [CommonModule, CpfPipe, CeilPipe],
  templateUrl: './tabela-usuarios.component.html',
  styleUrl: './tabela-usuarios.component.scss',
})
export class TabelaUsuariosComponent implements OnInit {
  usuarios: UsuarioResponseDTO[] = [];
  carregando = false;
  parametros: BuscarUsuariosParams = {
    pagina: 0,
    limite: 10,
  };
  totalElementos = 0;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.usuarioService.listarUsuarios(this.parametros).subscribe({
      next: (resposta) => {
        this.usuarios = resposta.content;
        this.totalElementos = resposta.totalElements;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      },
    });
  }

  mudarPagina(pagina: number): void {
    this.parametros.pagina = pagina;
    this.carregarUsuarios();
  }

  // Métodos auxiliares para exibição
  traduzirPerfil(perfil: PerfilUsuario): string {
    switch (perfil) {
      case PerfilUsuario.ADMIN:
        return 'Administrador';
      case PerfilUsuario.USUARIO:
        return 'Usuário';
      default:
        return perfil;
    }
  }

  traduzirStatus(status: StatusUsuario): string {
    switch (status) {
      case StatusUsuario.ATIVO:
        return 'Ativo';
      case StatusUsuario.INATIVO:
        return 'Inativo';
      default:
        return status;
    }
  }
}

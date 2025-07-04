/*
import { Component } from '@angular/core';

@Component({
  selector: 'app-lista-usuarios-content',
  standalone: true,
  imports: [],
  templateUrl: './lista-usuarios-content.component.html',
  styleUrl: './lista-usuarios-content.component.scss'
})
export class ListaUsuariosContentComponent {

}
*/
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  selector: 'app-lista-usuarios-content',
  standalone: true,
  imports: [CommonModule, CpfPipe, CeilPipe],
  templateUrl: './lista-usuarios-content.component.html',
  styleUrl: './lista-usuarios-content.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ListaUsuariosContentComponent implements OnInit {
  todosUsuarios: UsuarioResponseDTO[] = [];

  carregando = false;
  parametros: BuscarUsuariosParams = {
    pagina: 1,
    limite: 10,
  };
  totalElementos = 0;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }
  get usuariosPaginados(): UsuarioResponseDTO[] {
    const inicio = (this.parametros.pagina - 1) * this.parametros.limite;
    const fim = inicio + this.parametros.limite;
    return this.todosUsuarios.slice(inicio, fim);
  }
  carregarUsuarios(): void {
    this.carregando = true;
    this.todosUsuarios = [];
    console.log('Parâmetros enviados:', JSON.stringify(this.parametros));
    this.usuarioService.listarUsuarios(this.parametros).subscribe({
      next: (resposta: any) => {
        console.log('Resposta bruta:', resposta);

        // Verifica se a resposta JÁ É o array (caso novo)
        if (Array.isArray(resposta)) {
          this.todosUsuarios = resposta;
          this.totalElementos = resposta.length;
        }
        // Caso a resposta tenha a estrutura paginada (content)
        else if (resposta.content && Array.isArray(resposta.content)) {
          this.todosUsuarios = resposta.content;
          this.totalElementos = resposta.totalElements;
        }
        // Caso inesperado
        else {
          console.error('Formato de resposta desconhecido:', resposta);
          this.todosUsuarios = [];
          this.totalElementos = 0;
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro na requisição:', erro);
        this.carregando = false;
      },
    });
  }
  get usuarios(): UsuarioResponseDTO[] {
    const inicio = (this.parametros.pagina - 1) * this.parametros.limite;
    const fim = inicio + this.parametros.limite;
    return this.todosUsuarios.slice(inicio, fim);
  }

  mudarPagina(pagina: number): void {
    const totalPaginas = Math.ceil(
      this.totalElementos / this.parametros.limite
    );
    if (pagina < 1 || pagina > totalPaginas) return;
    this.parametros.pagina = pagina;
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

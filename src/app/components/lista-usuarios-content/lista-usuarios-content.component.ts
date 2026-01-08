import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { UsuarioService } from '../../modules/user/services/user.service';
import {
  UsuariosPaginadosResponse,
  UsuarioResponseDTO,
} from '../../shared/dtos/response/usuario-response.dto';
import { PerfilUsuario, StatusUsuario } from '../../shared/enums/user-enums';
import {
  BuscarUsuariosParams,
  FiltroUsuarios,
} from '../../shared/dtos/request/usuario-params.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CpfPipe } from '../../shared/pipes/cpf.pipe';
import { TabelaUsuariosComponent } from '../../components/tabela-usuarios/tabela-usuarios.component';
import { FiltrosUsuariosComponent } from '../filtros-usuarios/filtros-usuarios.component';
import { EditarUsuarioComponent } from '../editar-usuario/editar-usuario.component';
import { DeletarUsuarioComponent } from '../deletar-usuario/deletar-usuario.component';
import { CeilPipe } from '../../shared/pipes/ceil.pipe';
import { CriarUsuarioComponent } from '../criar-usuario/criar-usuario.component';

@Component({
  selector: 'app-lista-usuarios-content',
  standalone: true,
  imports: [
    CommonModule,
    CpfPipe,
    TabelaUsuariosComponent,
    FiltrosUsuariosComponent,
    CeilPipe,
    EditarUsuarioComponent,
    DeletarUsuarioComponent,
    CriarUsuarioComponent,
  ],
  templateUrl: './lista-usuarios-content.component.html',
  styleUrl: './lista-usuarios-content.component.scss',
  //encapsulation: ViewEncapsulation.None,
})
export class ListaUsuariosContentComponent implements OnInit {
  todosUsuarios: UsuarioResponseDTO[] = [];

  carregando = false;
  parametros: BuscarUsuariosParams = {
    pagina: 0,
    limite: 10,
  };
  totalElementos = 0;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }
  get usuariosPaginados(): UsuarioResponseDTO[] {
    return this.todosUsuarios; // backend já devolve paginado
  }
  carregarUsuarios(): void {
    this.carregando = true;
    this.todosUsuarios = [];
    console.log('Parâmetros enviados:', JSON.stringify(this.parametros));
    this.usuarioService.listarUsuariosPaginado(this.parametros).subscribe({
      // Caso a resposta tenha a estrutura paginada (content)
      next: (resposta: any) => {
        //console.log('Resposta bruta:', resposta);

        // Verifica se a resposta já é o array
        if (Array.isArray(resposta)) {
          this.todosUsuarios = resposta;
          this.totalElementos = resposta.length;
        }
        // Caso a resposta tenha a estrutura paginada (content)
        else if (resposta.content && Array.isArray(resposta.content)) {
          this.todosUsuarios = resposta.content; // Array de usuários
          this.totalElementos = resposta.totalElements; // Total de elementos para calcular o número de páginas
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
  abrirModalAdicionarUsuario() {
    const modalRef = this.modalService.open(CriarUsuarioComponent, {
      centered: true,
      size: 'md', // ou 'lg' se o formulário for grande
      backdrop: 'static', // Impede fechar ao clicar fora (evita perda de dados)
    });

    modalRef.result.then(
      (resultado) => {
        // Se o componente de criação disparar activeModal.close('salvo')
        if (resultado === 'salvo') {
          this.carregarUsuarios(); // Atualiza a tabela com o novo usuário
        }
      },
      (reason) => {
        // Modal fechado ou cancelado
        console.log('Criação de usuário cancelada');
      }
    );
  }

  abrirModalEdicao(usuario: UsuarioResponseDTO) {
    const modalRef = this.modalService.open(EditarUsuarioComponent, {
      size: 'sm',
      centered: true,
      backdrop: 'static', // Impede fechar ao clicar fora
    });
    // Passa o objeto do usuário para o @Input do componente de edição
    modalRef.componentInstance.usuario = { ...usuario };

    // Quando o modal fechar com sucesso
    modalRef.result.then(
      (resultado) => {
        if (resultado === 'salvo') {
          this.carregarUsuarios(); // Recarrega a tabela
        }
      },
      () => {}
    );
  }

  abrirModalExclusao(usuario: UsuarioResponseDTO): void {
    const modalRef = this.modalService.open(DeletarUsuarioComponent, {
      size: 'md', // Tamanho médio é ideal para alertas de exclusão
      centered: true, // Centraliza no meio da tela
      backdrop: 'static', // Impede fechar ao clicar fora, forçando a escolha do usuário
      keyboard: false, // Impede fechar ao apertar ESC
    });

    // Passa o usuário para o @Input() do componente do modal
    modalRef.componentInstance.usuario = usuario;

    // Gerencia o resultado após o fechamento do modal
    modalRef.result.then(
      (resultado) => {
        // Se o modal foi fechado via .close('deletado') no componente filho
        if (resultado === 'deletado') {
          this.carregarUsuarios(); // Chama sua função existente para dar refresh na lista
        }
      },
      (reason) => {
        // Este bloco captura o 'dismiss' (quando o usuário clica em Cancelar ou fecha no X)
        // Geralmente não precisamos fazer nada aqui, apenas evitar o erro de 'Uncaught Promise'
        console.log('Exclusão cancelada pelo usuário');
      }
    );
  }

  mudarPagina(paginaAtual: number): void {
    const totalPaginas = Math.ceil(
      this.totalElementos / this.parametros.limite
    );
    if (paginaAtual < 0 || paginaAtual > totalPaginas) return;

    this.parametros.pagina = paginaAtual - 1;
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
  aplicarFiltros(filtros: FiltroUsuarios): void {
    this.parametros = {
      ...this.parametros,
      ...filtros,
      pagina: 0, // reinicia a página
    };
    this.carregarUsuarios();
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';
import { PerfilUsuario, StatusUsuario } from '../../shared/enums/user-enums';
import { CpfPipe } from '../../shared/pipes/cpf.pipe';

@Component({
  selector: 'app-tabela-usuarios',
  standalone: true,
  imports: [CommonModule, CpfPipe],
  templateUrl: './tabela-usuarios.component.html',
})
export class TabelaUsuariosComponent implements OnChanges {
  @Input() usuarios: UsuarioResponseDTO[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Usuarios recebidos pelo componente filho:', this.usuarios);
  }
  @Input() paginaAtual: number = 1;
  @Input() totalElementos: number = 0;
  @Input() itensPorPagina: number = 10;
  @Input() carregando: boolean = false;

  @Output() mudarPagina = new EventEmitter<number>();

  get totalPaginas(): number {
    return Math.ceil(this.totalElementos / this.itensPorPagina);
  }

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

  alterarPagina(pagina: number) {
    this.mudarPagina.emit(pagina);
  }

  preencherLinhasVazias(linhasUsadas: number): number[] {
    const maxLinhas = 10; // ou `this.parametros.limite`
    const faltantes = maxLinhas - linhasUsadas;
    return Array.from({ length: faltantes > 0 ? faltantes : 0 });
  }
}

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necessário para o *ngFor funcionar no HTML
import { RelatoriosService } from '../relatorios.service';
import { CartorioService } from '../../../modules/cartorio/cartorio.service'; // Ajuste o caminho se necessário
import { UsuarioService } from '../../../modules/user/services/user.service'; // Injete o seu serviço real de Usuários
import { DocumentoService } from '../../../modules/documents/services/documents.service';
import { RelatorioFiltroDTO } from '../../../shared/models/relatorio.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filtros-relatorio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './filtros-relatorios.component.html',
  styleUrls: ['./filtros-relatorios.component.scss'],
})
export class FiltrosRelatorioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private relatoriosService = inject(RelatoriosService);
  private cartorioService = inject(CartorioService);
  private usuarioService = inject(UsuarioService);
  private documentoService = inject(DocumentoService);

  tiposDocumento: any[] = [];
  cartorios: any[] = [];
  usuarios: any[] = [];

  private sub = new Subscription();

  formFiltros = this.fb.group({
    dataInicial: [null],
    dataFinal: [null],
    tiposDocumentoIds: [[] as number[]],
    cartoriosIds: [[] as number[]],
    usuariosIds: [[] as number[]],
  });

  ngOnInit(): void {
    // 1. Escuta reativamente o fluxo de Cartórios e mapeia o retorno do Spring Boot
    this.sub.add(
      this.cartorioService.cartorios$.subscribe({
        next: (res: any) => {
          // Trata se o backend retornar a paginação (res.content) ou lista direta
          this.cartorios = res.content || (Array.isArray(res) ? res : []);
        },
        error: (err) =>
          console.error('Erro ao carregar cartórios para o filtro', err),
      }),
    );

    // 2. Escuta reativamente o fluxo de Usuários do seu sistema
    this.sub.add(
      this.usuarioService.usuarios$.subscribe({
        next: (res: any) => {
          this.usuarios = res.content || (Array.isArray(res) ? res : []);
        },
        error: (err) =>
          console.error('Erro ao carregar usuários para o filtro', err),
      }),
    );

    // 3. Força os serviços a irem ao backend Java buscar os dados mais recentes caso estejam vazios
    this.cartorioService.carregarCartorios();
    this.usuarioService.carregarUsuarios(); // Ajuste para o método real do seu serviço de usuários
  }

  emitirBusca() {
    const filtros: RelatorioFiltroDTO = this.formFiltros
      .value as RelatorioFiltroDTO;
    this.relatoriosService.buscarDadosRelatorio(filtros);
  }

  ngOnDestroy(): void {
    // Cancela todas as inscrições quando o usuário sai da página de relatórios
    this.sub.unsubscribe();
  }
}

import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RelatoriosService } from '../relatorios.service';
import { CartorioService } from '../../../modules/cartorio/cartorio.service';
import { UsuarioService } from '../../../modules/user/services/user.service';
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
export class FiltrosRelatorioComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private relatoriosService = inject(RelatoriosService);
  private cartorioService = inject(CartorioService);
  private usuarioService = inject(UsuarioService);
  private documentoService = inject(DocumentoService);

  // CORREÇÃO: Todos os nomes agora estão estritamente no PLURAL, combinando com o HTML!
  tiposDocumento: any[] = [];
  cartorios: any[] = [];
  usuarios: any[] = [];

  // Controla qual menu dropdown está expandido na tela
  menuAberto: 'doc' | 'cartorio' | 'usuario' | null = null;

  private sub = new Subscription();

  formFiltros = this.fb.group({
    dataInicial: [null],
    dataFinal: [null],
    tiposDocumentoIds: [[] as number[]],
    cartoriosIds: [[] as number[]],
    usuariosIds: [[] as number[]],
  });

  ngOnInit(): void {
    // 1. Escuta reativamente o fluxo de Cartórios
    this.sub.add(
      this.cartorioService.cartorios$.subscribe({
        next: (res: any) => {
          this.cartorios = res.content || (Array.isArray(res) ? res : []);
        },
        error: (err) =>
          console.error('Erro ao carregar cartórios para o filtro', err),
      }),
    );

    // 2. Escuta reativamente o fluxo de Usuários (Bando de dados centralizado via usuarios$)
    this.sub.add(
      this.usuarioService.usuarios$.subscribe({
        next: (res: any) => {
          this.usuarios = res.content || (Array.isArray(res) ? res : []);
        },
        error: (err) =>
          console.error('Erro ao carregar usuários para o filtro', err),
      }),
    );

    // Adicionado o listener para carregar e escutar os Tipos de Documento do seu sistema

    this.sub.add(
      this.documentoService.listarDocumentos().subscribe({
        next: (res: any) => {
          // Como o documento.service.ts retorna mapeado dentro de um objeto contendo .content, extraímos ele aqui:
          this.tiposDocumento =
            res && res.content ? res.content : Array.isArray(res) ? res : [];
          console.log(
            'Tipos de documentos carregados para o relatório:',
            this.tiposDocumento,
          );
        },
        error: (err) =>
          console.error(
            'Erro ao carregar tipos de documento para o filtro',
            err,
          ),
      }),
    );

    // Dispara as cargas iniciais indo buscar as informações no Spring Boot
    this.cartorioService.carregarCartorios();
    this.usuarioService.carregarUsuarios();
    this.documentoService.listarTiposDocumentosAtivos();
  }

  // Alterna a abertura dos menus de forma segura
  toggleMenu(menu: 'doc' | 'cartorio' | 'usuario') {
    this.menuAberto = this.menuAberto === menu ? null : menu;
  }

  // Verifica na lista do Form para deixar o checkbox marcado visualmente
  isCheckboxSelecionado(controleNome: string, id: number): boolean {
    const listaIds =
      (this.formFiltros.get(controleNome)?.value as number[]) || [];
    return listaIds.includes(id);
  }

  // Adiciona ou remove os IDs do Form Array reativo dinamicamente
  onCheckboxChange(controleNome: string, id: number) {
    const controle = this.formFiltros.get(controleNome);
    let listaIds = [...((controle?.value as number[]) || [])];

    if (listaIds.includes(id)) {
      listaIds = listaIds.filter((itemId) => itemId !== id);
    } else {
      listaIds.push(id);
    }

    controle?.setValue(listaIds);
  }

  @HostListener('document:click', ['$event'])
  cliqueForaDaTela(event: MouseEvent) {
    const elementoClicado = event.target as HTMLElement;
    if (!elementoClicado.closest('.dropdown-customizado')) {
      this.menuAberto = null;
    }
  }

  emitirBusca() {
    const filtros: RelatorioFiltroDTO = this.formFiltros.value as any;
    this.relatoriosService.buscarDadosRelatorio(filtros);
  }

  ngOnDestroy(): void {
    // Evita vazamento de memória ao trocar de página no app
    this.sub.unsubscribe();
  }
}

import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RelatoriosService } from '../relatorios.service';
import { CartorioService } from '../../../modules/cartorio/cartorio.service';
import { UsuarioService } from '../../../modules/user/services/user.service';
import { DocumentoService } from '../../../modules/documents/services/documents.service';
import { RelatorioFiltroDTO } from '../../../shared/models/relatorio.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filtros-relatorio',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
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
    // 1. Tipos de Documento (A requisição já é disparada no exato momento do .subscribe)
    this.sub.add(
      this.documentoService.listarTodosTiposDocumentos().subscribe({
        next: (res: any) => {
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
    /*
    // 2. Cartórios (O componente gerencia e assina o método do serviço)
    this.sub.add(
      this.cartorioService.carregarCartorios().subscribe({
        next: (res: any) => {
          this.cartorios = res.content || (Array.isArray(res) ? res : []);
          console.log('Cartórios carregados para o relatório:', this.cartorios);
        },
        error: (err) =>
          console.error('Erro ao carregar cartórios para o filtro', err),
      }),
    );
*/
    this.sub.add(
      this.cartorioService.carregarCartorios().subscribe({
        next: (res: any) => {
          console.log('RETORNO BRUTO CARTORIOS:', res);
          console.log('É array?', Array.isArray(res));
          console.log('content?', res?.content);

          this.cartorios = res?.content || (Array.isArray(res) ? res : []);

          console.log('ATRIBUÍDO PARA TELA:', this.cartorios);
        },
        error: (err) => console.error(err),
      }),
    );
    // 3. Usuários (O componente gerencia e assina o método do serviço)
    this.sub.add(
      this.usuarioService.carregarUsuarios().subscribe({
        next: (res: any) => {
          this.usuarios = res.content || (Array.isArray(res) ? res : []);
          console.log('Usuários carregados para o relatório:', this.usuarios);
        },
        error: (err) =>
          console.error('Erro ao carregar usuários para o filtro', err),
      }),
    );
  }

  // Alterna a abertura dos menus de forma segura
  toggleMenu(menu: 'doc' | 'cartorio' | 'usuario', event?: MouseEvent) {
    event?.stopPropagation();

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

  limparFiltros(): void {
    this.formFiltros.reset({
      dataInicial: null,
      dataFinal: null,
      tiposDocumentoIds: [],
      cartoriosIds: [],
      usuariosIds: [],
    });

    this.emitirBusca(); // opcional
  }
}

import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { BotaoComponent } from '../../botao/botao.component';
import { CommonModule, AsyncPipe, isPlatformBrowser } from '@angular/common';
import { DocumentoService } from '../../../modules/documents/services/documents.service';
import { CartorioService } from '../../../modules/cartorio/cartorio.service';
import { TipoDocumentoDTO } from '../../../shared/dtos/response/documento-response.dto';
import { GerarNumeracaoDto } from '../../../shared/dtos/request/gerar-numeracao.dto';
import { NumeradorService } from '../numerador.service';
import { AuthService } from '../../../modules/auth/auth.service';
import { ContagemGraficoDto } from '../contagem-grafico.dto';

@Component({
  selector: 'app-numerador',
  standalone: true,
  imports: [CommonModule, BotaoComponent, AsyncPipe],
  templateUrl: './numerador.component.html',
  styleUrl: './numerador.component.scss',
})
export class NumeradorComponent implements OnInit, OnDestroy {
  cartorios: any[] = [];
  documentos$!: Observable<TipoDocumentoDTO[]>;
  private idUsuarioLogado: number | undefined;

  // Guardará as contagens em tempo real para exibir na tabela
  private listaContagens: ContagemGraficoDto[] = [];
  private subContagens!: Subscription;

  constructor(
    private documentsService: DocumentoService,
    private numeradorService: NumeradorService,
    private cartorioService: CartorioService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.authService.getUsuarioLogadoId().subscribe((id) => {
      this.idUsuarioLogado = id ?? undefined;
    });

    this.documentos$ = this.documentsService
      .listarTiposDocumentosAtivos()
      .pipe(map((dados) => dados as TipoDocumentoDTO[]));

    this.cartorioService.carregarCartorios().subscribe({
      next: (res: any) => {
        this.cartorios = res?.content || (Array.isArray(res) ? res : []);
      },
      error: (err) => console.error(err),
    });

    // Escuta o canal de contagens do serviço para atualizar a coluna 'Contagem' dinamicamente
    this.subContagens = this.numeradorService.contagens$.subscribe({
      next: (contagens) => {
        this.listaContagens = contagens;
      },
    });

    // Carga inicial do histórico
    this.numeradorService.carregarECompartilharContagens();
  }

  ngOnDestroy(): void {
    if (this.subContagens) {
      this.subContagens.unsubscribe();
    }
  }

  // Retorna a contagem real baseada no nome do documento do gráfico/logs
  obterContagemDocumento(nomeDocumento: string): number {
    const item = this.listaContagens.find((c) => c.nome === nomeDocumento);
    return item ? item.contagem : 0;
  }

  // Modificado para aceitar o ID do cartório vindo do HTML select
  gerarDocumento(documento: TipoDocumentoDTO, cartorioIdString: string) {
    const cartorioId = parseInt(cartorioIdString, 10);

    if (!cartorioId || isNaN(cartorioId)) {
      alert('Por favor, selecione um cartório antes de gerar o documento.');
      return;
    }

    if (documento && documento.id > 0 && this.idUsuarioLogado) {
      const dadosGeracao: GerarNumeracaoDto = {
        tipoDocumentoId: documento.id,
        cartorioId: cartorioId, // Agora usa o id dinâmico selecionado!
        usuarioId: this.idUsuarioLogado,
      };

      this.documentsService.gerarNumeracao(dadosGeracao).subscribe({
        next: (resposta) => {
          console.log('Documento gerado com sucesso:', resposta);
          // Atualiza contadores e logs globalmente
          this.numeradorService.carregarECompartilharContagens();
        },
        error: (err) => {
          console.error('Erro ao gerar documento:', err);
        },
      });
    } else {
      console.error(
        `Falha na geração. IDs: Tipo (${documento?.id}), Usuário (${this.idUsuarioLogado}).`,
      );
    }
  }
}

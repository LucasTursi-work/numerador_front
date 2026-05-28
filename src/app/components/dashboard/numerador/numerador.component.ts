import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Observable, map } from 'rxjs';
import { BotaoComponent } from '../../botao/botao.component';
import { CommonModule, AsyncPipe, isPlatformBrowser } from '@angular/common';
import { DocumentoService } from '../../../modules/documents/services/documents.service';
import {
  DocumentoResponseDto,
  TipoDocumentoDTO,
} from '../../../shared/dtos/response/documento-response.dto';
import { GerarNumeracaoDto } from '../../../shared/dtos/request/gerar-numeracao.dto';
import { UsuarioService } from '../../../modules/user/services/user.service';
import { NumeradorService } from '../numerador.service';
import { AuthService } from '../../../modules/auth/auth.service';

@Component({
  selector: 'app-numerador',
  standalone: true,
  imports: [CommonModule, BotaoComponent, AsyncPipe],
  templateUrl: './numerador.component.html',
  styleUrl: './numerador.component.scss',
})
export class NumeradorComponent implements OnInit {
  documentos$!: Observable<TipoDocumentoDTO[]>;
  private idUsuarioLogado: number | undefined;

  constructor(
    private documentsService: DocumentoService,
    private numeradorService: NumeradorService,
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

    // apenas esta linha — ela já atualiza o documentosSubject internamente
    this.numeradorService.carregarECompartilharContagens();
  }
  /*
  private buscarUltimosDocumentos() {
    this.documentsService.buscarUltimosDocumentos().subscribe({
      next: (data) => {
        this.documentos$ = data;
      },
      error: (err) => {
        console.error('Erro ao buscar últimos documentos', err);
      },
    });
  }
*/
  gerarDocumento(documento: TipoDocumentoDTO) {
    // 1. Mudamos a tipagem para o que vem do HTML
    // Validação ajustada para ler as propriedades reais do TipoDocumentoDTO
    if (
      documento &&
      documento.id > 0 && // O id do TipoDocumentoDTO é o ID do tipo!
      this.idUsuarioLogado // Garantir que o ID da sessão foi carregado
    ) {
      const dadosGeracao: GerarNumeracaoDto = {
        tipoDocumentoId: documento.id, // Passa o ID do tipo de documento correto
        cartorioId: 1, // Defina o id do cartório do usuário/sistema aqui
        usuarioId: this.idUsuarioLogado, // Preenche o campo obrigatório do DTO
      };

      this.documentsService.gerarNumeracao(dadosGeracao).subscribe({
        next: (resposta) => {
          console.log('Documento gerado com sucesso:', resposta);

          // ⚠️ ESSA LINHA FAZ A MÁGICA: Notifica o serviço global.
          // O serviço vai bater no backend, pegar a lista de emissões atualizada,
          // recalcular os contadores do gráfico e injetar as linhas novas nos Logs!
          this.numeradorService.carregarECompartilharContagens();
        },
        error: (err) => {
          console.error('Erro ao gerar documento:', err);
        },
      });
    } else {
      // Console log de erro ajustado para refletir as variáveis corretas do botão
      console.error(
        'Falha na geração: dados críticos faltando. IDs necessários: Tipo (' +
          documento?.id +
          '), Usuário Logado (' +
          this.idUsuarioLogado +
          ').',
      );
    }
  }
}

import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { BotaoComponent } from '../../botao/botao.component';
import { CommonModule, AsyncPipe, isPlatformBrowser } from '@angular/common';
import { DocumentoService } from '../../../modules/documents/services/documents.service';
import { DocumentoResponseDto } from '../../../shared/dtos/response/documento-response.dto';
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
  documentos$!: Observable<DocumentoResponseDto[]>;
  private idUsuarioLogado: number | undefined;

  constructor(
    private documentsService: DocumentoService,
    private numeradorService: NumeradorService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
/*
  ngOnInit(): void {
    // 1. OBTÉM O ID DO USUÁRIO LOGADO via AuthService
    this.authService.getUsuarioLogadoId().subscribe((id) => {
      // O ID pode ser null no estado inicial, trata-se o valor como number ou undefined
      this.idUsuarioLogado = id ?? undefined;
    });
    this.documentos$ = this.documentsService.ultimosDocumentos$;
    //Assina o Observable do serviço. A lista será carregada quando o service emitir.

    this.documentsService.buscarUltimosDocumentos().subscribe();
    //Aciona a carga inicial para preencher o Subject pela primeira vez

    //Aciona a carga inicial para o gráfico (via service compartilhado)
    this.numeradorService.carregarECompartilharContagens();
  }
  */

  ngOnInit(): void {
   if (!isPlatformBrowser(this.platformId)) return;
  this.authService.getUsuarioLogadoId().subscribe((id) => {
    this.idUsuarioLogado = id ?? undefined;
  });

  this.documentos$ = this.documentsService.ultimosDocumentos$;
  
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
  gerarDocumento(documento: DocumentoResponseDto) {
    // Validação
    if (
      documento &&
      documento.tipoDocumentoId > 0 &&
      documento.cartorioId > 0 &&
      this.idUsuarioLogado // Garantir que o ID da sessão foi carregado
    ) {
      const dadosGeracao: GerarNumeracaoDto = {
        tipoDocumentoId: documento.tipoDocumentoId,
        cartorioId: documento.cartorioId,
        usuarioId: this.idUsuarioLogado, // Preenche o campo obrigatório do DTO
        // Os campos 'id', 'numero', 'dataCadastro' são omitidos
      };

      this.documentsService.gerarNumeracao(dadosGeracao).subscribe({
        next: (resposta) => {
          console.log('Documento gerado com sucesso:', resposta);
          // ⚠️ CHAVE: Notifica o serviço para recarregar as contagens do backend.
          // Isso garante que o 'numero' (contagem) atualizado seja buscado.
          this.numeradorService.carregarECompartilharContagens();
          // Recarrega a tabela, atualiza a contagem local
        },
        error: (err) => {
          console.error('Erro ao gerar documento:', err);
        },
      });
    } else {
      console.error(
        'Falha na geração: dados críticos faltando. IDs necessários: Tipo (' +
          documento?.tipoDocumentoId +
          '), Cartório (' +
          documento?.cartorioId +
          '), Usuário Logado (' +
          this.idUsuarioLogado +
          ').'
      );
    }
  }
}

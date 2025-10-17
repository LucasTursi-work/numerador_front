import { Component, OnInit, ViewChild } from '@angular/core';
import { BotaoComponent } from '../../botao/botao.component';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../../modules/documents/services/documents.service';
import { DocumentoResponseDto } from '../../../shared/dtos/response/documento-response.dto';
import { CriarDocumentoModalComponent } from '../../criar-documento-modal/criar-documento-modal.component';
import { GerarNumeracaoDto } from '../../../shared/dtos/request/gerar-numeracao.dto';
import { UsuarioService } from '../../../modules/user/services/user.service';
import { NumeradorService } from '../numerador.service';
import { AuthService } from '../../../modules/auth/auth.service';

@Component({
  selector: 'app-numerador',
  standalone: true,
  imports: [CommonModule, BotaoComponent, CriarDocumentoModalComponent],
  templateUrl: './numerador.component.html',
  styleUrl: './numerador.component.scss',
})
export class NumeradorComponent implements OnInit {
  @ViewChild('modalGerar') modalGerarComponent!: CriarDocumentoModalComponent;
  documentos: DocumentoResponseDto[] = [];
  private idUsuarioLogado: number | undefined;
  constructor(
    private documentsService: DocumentoService,
    private numeradorService: NumeradorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 1. OBTÉM O ID DO USUÁRIO LOGADO via AuthService
    this.authService.getUsuarioLogadoId().subscribe((id) => {
      this.idUsuarioLogado = id;
    });

    // 2. Aciona a carga inicial para o gráfico (via service compartilhado)
    this.numeradorService.carregarECompartilharContagens();

    // 3. Busca os dados para preencher a tabela
    this.buscarUltimosDocumentos();
  }

  private buscarUltimosDocumentos() {
    this.documentsService.buscarUltimosDocumentos().subscribe({
      next: (data) => {
        this.documentos = data;
      },
      error: (err) => {
        console.error('Erro ao buscar últimos documentos', err);
      },
    });
  }

  onGerarClick(): void {
    // Acessa a instância do componente filho e chama o método
    this.modalGerarComponent.abrirModal();
  }

  gerarDocumento(index: number) {
    const documento = this.documentos[index];
    // Validação
    if (
      documento &&
      documento.tipoDocumento &&
      documento.cartorio &&
      this.idUsuarioLogado // Garantir que o ID da sessão foi carregado
    ) {
      const dadosGeracao: GerarNumeracaoDto = {
        tipoDocumentoId: documento.tipoDocumento.id,
        cartorioId: documento.cartorio.id,
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
          this.buscarUltimosDocumentos();
        },
        error: (err) => {
          console.error('Erro ao gerar documento:', err);
        },
      });
    } else {
      console.error(
        'Falha na geração: dados críticos faltando (ID: ' +
          this.idUsuarioLogado +
          ').'
      );
    }
  }
}

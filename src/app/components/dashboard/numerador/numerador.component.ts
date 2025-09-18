import { Component, OnInit } from '@angular/core';
import { BotaoComponent } from '../../botao/botao.component';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../../modules/documents/services/documents.service';
import { DocumentoResponseDto } from '../../../shared/dtos/response/documento-response.dto';

@Component({
  selector: 'app-numerador',
  standalone: true,
  imports: [CommonModule, BotaoComponent],
  templateUrl: './numerador.component.html',
  styleUrl: './numerador.component.scss',
})
export class NumeradorComponent implements OnInit {
  documentos: DocumentoResponseDto[] = [];

  constructor(private documentsService: DocumentoService) {}

  ngOnInit(): void {
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

  gerarDocumento(index: number) {
    const documento = this.documentos[index];
    if (documento) {
      // Aqui você precisará dos dados do usuário, tipo e cartório para o DTO
      // Por enquanto, vamos simular a chamada
      const dadosGeracao = {
        id: documento.idDocumento,
        tipoDocumentoId: documento.tipoDocumento.id,
        cartorioId: documento.cartorio.id,
        usuarioId: documento.usuario.id,
        numero: documento.numero,
        dataCadastro: documento.dataCadastro,
      };

      this.documentsService.gerarNumeracao(dadosGeracao).subscribe({
        next: (resposta) => {
          console.log('Documento gerado com sucesso!', resposta);
          this.buscarUltimosDocumentos(); // Atualiza a lista
        },
        error: (err) => {
          console.error('Erro ao gerar numeração', err);
        },
      });
    }
  }
}

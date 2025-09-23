import { Component, OnInit } from '@angular/core';
import { DocumentsService } from '../../../modules/documents/services/documents.service';
import { DocumentoResponseDto } from '../../../shared/dtos/response/documento-response.dto';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent {
  logs: DocumentoLog[] = [];

  constructor(private documentsService: DocumentsService) {}

  ngOnInit(): void {
    this.documentsService.getUltimosDocumentos().subscribe({
      next: (dados) => {
        this.logs = dados;
      },
      error: (e) => {
        console.error('Erro ao buscar logs de documentos:', e);
        // Implementar tratamento de erro (ex: mostrar mensagem ao usuário)
      },
    });
  }
}

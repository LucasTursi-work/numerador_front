import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../../modules/documents/services/documents.service';
import { DocumentoResponseDto } from '../../../shared/dtos/response/documento-response.dto';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent implements OnInit {
  logs: DocumentoResponseDto[] = [];

  constructor(private documentsService: DocumentoService) {}

  ngOnInit(): void {
    this.documentsService.buscarUltimosDocumentos().subscribe({
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

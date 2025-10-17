import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { NumeradorData } from './numerador-data.dto';
import { ContagemGraficoDto } from './contagem-grafico.dto';
import { DocumentoResponseDto } from './../../shared/dtos/response/documento-response.dto';
import { DocumentoService } from './../../modules/documents/services/documents.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root', // Torna o serviço um Singleton global
})
export class NumeradorService {
  private apiUrl = `${environment.apiUrl}/numerador`;
  // BehaviorSubject: armazena o valor atual e notifica os inscritos
  private contagensSubject = new BehaviorSubject<ContagemGraficoDto[]>([]);
  // Observable público: componentes se inscrevem neste para receber os dados
  public contagens$: Observable<ContagemGraficoDto[]> =
    this.contagensSubject.asObservable();
  constructor(private documentsService: DocumentoService) {}

  public carregarECompartilharContagens(): void {
    this.documentsService.buscarUltimosDocumentos().subscribe({
      next: (dadosBackend: DocumentoResponseDto[]) => {
        // Contagem da quantidade de documentos localmente no frontend
        const dadosParaGrafico: ContagemGraficoDto[] = dadosBackend.map(
          (doc: DocumentoResponseDto) => ({
            nome: doc.tipoDocumento.nome || 'Desconhecido', // Nome do documento (rótulo)
            contagem: doc.numero, // O número sequencial (o valor para o gráfico)
          })
        );

        // Publica os dados processados (ContagemGraficoDto[])
        this.contagensSubject.next(dadosParaGrafico);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Erro ao carregar e processar contagens:', e);
        this.contagensSubject.next([]);
      },
    });
  }
}

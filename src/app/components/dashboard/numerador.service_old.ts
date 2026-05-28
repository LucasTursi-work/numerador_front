import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { ContagemGraficoDto } from './contagem-grafico.dto';
import { DocumentoResponseDto } from './../../shared/dtos/response/documento-response.dto';
import { TipoDocumentoDTO } from './../../shared/dtos/response/documento-response.dto';

@Injectable({ providedIn: 'root' })
export class NumeradorService {
  private documentosAtivosSubject = new BehaviorSubject<TipoDocumentoDTO[]>([]);
  public documentosAtivos$: Observable<TipoDocumentoDTO[]> =
    this.documentosAtivosSubject.asObservable();

  private contagensSubject = new BehaviorSubject<ContagemGraficoDto[]>([]);
  public contagens$: Observable<ContagemGraficoDto[]> =
    this.contagensSubject.asObservable();

  // Injeta o DocumentoService para DELEGAR a chamada HTTP
  constructor(private documentsService: DocumentoService) {}

  public carregarECompartilharContagens(): void {
    // A chamada é feita aqui, através do serviço que detém a URL correta (/documentos/ultimos)
    this.documentsService.listarTiposDocumentosAtivos().subscribe({
      next: (dadosBackend: any[]) => {
        this.documentosAtivosSubject.next(dadosBackend as TipoDocumentoDTO[]);
        // Mapeia e compartilha os dados...
        const dadosParaGrafico: ContagemGraficoDto[] = dadosBackend.map(
          (doc) => ({
            nome: doc.nome || 'Desconhecido',
            contagem: doc.id || 0,
          }),
        );

        this.contagensSubject.next(dadosParaGrafico);
      },
      error: (e) => {
        console.error('Erro ao carregar e processar contagens e ativos:', e);
        this.documentosAtivosSubject.next([]);
        this.contagensSubject.next([]);
      },
    });
  }
}

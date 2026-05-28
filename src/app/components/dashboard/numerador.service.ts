import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { ContagemGraficoDto } from './contagem-grafico.dto';
import { DocumentoResponseDto } from './../../shared/dtos/response/documento-response.dto';

@Injectable({ providedIn: 'root' })
export class NumeradorService {
  // Canal 1: Dados formatados para o componente de Gráfico
  private contagensSubject = new BehaviorSubject<ContagemGraficoDto[]>([]);
  public contagens$: Observable<ContagemGraficoDto[]> =
    this.contagensSubject.asObservable();

  // Canal 2: Lista bruta de emissões clicadas para o componente de Logs
  private historicoDocumentosSubject = new BehaviorSubject<
    DocumentoResponseDto[]
  >([]);
  public historicoDocumentos$: Observable<DocumentoResponseDto[]> =
    this.historicoDocumentosSubject.asObservable();

  constructor(private documentsService: DocumentoService) {}

  public carregarECompartilharContagens(): void {
    // Busca do backend a lista de tudo que foi clicado/gerado de verdade
    this.documentsService.buscarUltimosDocumentos().subscribe({
      next: (dadosBackend: DocumentoResponseDto[]) => {
        // 1. Envia a lista bruta direto para o Componente de LOGS
        this.historicoDocumentosSubject.next(dadosBackend);

        // 2. Processa a mesma lista para contar os cliques de cada tipo para o GRÁFICO
        const contagemAgrupada: { [key: string]: number } = {};

        dadosBackend.forEach((doc) => {
          const nomeTipo = doc.nomeTipoDocumento || 'Desconhecido';
          // Se o tipo já foi clicado antes, soma +1, se não, começa com 1
          contagemAgrupada[nomeTipo] = (contagemAgrupada[nomeTipo] || 0) + 1;
        });

        // Transforma o agrupamento no formato esperado pelo 'graficos.component'
        const dadosParaGrafico: ContagemGraficoDto[] = Object.keys(
          contagemAgrupada,
        ).map((nome) => ({
          nome: nome,
          contagem: contagemAgrupada[nome], // Quantidade real de cliques/emissões
        }));

        // Envia os dados mastigados para o componente de Gráfico
        this.contagensSubject.next(dadosParaGrafico);
      },
      error: (e) => {
        console.error('Erro ao carregar emissões do numerador:', e);
        this.historicoDocumentosSubject.next([]);
        this.contagensSubject.next([]);
      },
    });
  }
}

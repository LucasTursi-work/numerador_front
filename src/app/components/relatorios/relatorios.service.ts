import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RelatorioFiltroDTO, RelatorioResultadoDTO } from '../../shared/models/relatorio.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RelatoriosService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/relatorios`;

  // Estado reativo dos dados da tela
  private resultadoSubject = new BehaviorSubject<RelatorioResultadoDTO | null>(null);
  resultado$ = this.resultadoSubject.asObservable();

  // Busca dados para alimentar os gráficos e a tabela de logs
  buscarDadosRelatorio(filtros: RelatorioFiltroDTO): void {
    this.http.post<RelatorioResultadoDTO>(`${this.apiUrl}/dados`, filtros)
      .subscribe({
        next: (dados) => this.resultadoSubject.next(dados),
        error: (err) => console.error('Erro ao buscar dados do relatório', err)
      });
  }

  // Baixa o arquivo processado pelo Backend (PDF ou CSV)
  baixarArquivo(filtros: RelatorioFiltroDTO, formato: 'pdf' | 'csv'): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/exportar/${formato}`, filtros, {
      responseType: 'blob'
    });
  }
}
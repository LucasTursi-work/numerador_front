import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  RelatorioFiltroDTO,
  RelatorioResultadoDTO,
} from '../../shared/models/relatorio.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RelatoriosService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/relatorios`;

  // --- MODIFICAÇÃO: Variável interna para guardar o último filtro usado ---
  private filtroAtual: RelatorioFiltroDTO | null = null;

  // Estado reativo dos dados da tela
  private resultadoSubject = new BehaviorSubject<RelatorioResultadoDTO | null>(
    null,
  );
  resultado$ = this.resultadoSubject.asObservable();

  // Busca dados para alimentar os gráficos e a tabela de logs
  buscarDadosRelatorio(filtros: RelatorioFiltroDTO): void {
    // --- MODIFICAÇÃO: Salva o filtro recebido antes de disparar o POST ---
    this.filtroAtual = filtros;

    this.http
      .post<RelatorioResultadoDTO>(`${this.apiUrl}/dados`, filtros)
      .subscribe({
        next: (dados) => this.resultadoSubject.next(dados),
        error: (err) => console.error('Erro ao buscar dados do relatório', err),
      });
  }

  // --- MODIFICAÇÃO: Função para o componente de output conseguir pegar o filtro guardado ---
  public obterFiltroAtual(): RelatorioFiltroDTO | null {
    return this.filtroAtual;
  }

  // Baixa o arquivo processado pelo Backend (PDF ou CSV)
  baixarArquivo(
    filtros: RelatorioFiltroDTO,
    formato: 'pdf' | 'csv',
  ): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/exportar/${formato}`, filtros, {
      responseType: 'blob', // Garante que o Angular trate o retorno como arquivo binário
    });
  }
}
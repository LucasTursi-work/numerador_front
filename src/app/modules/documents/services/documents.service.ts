import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Status } from '../../../shared/enums/documents-enums';
import { DocumentoResponseDto } from '../../../shared/dtos/response/documento-response.dto';
import { UpdateDocumentoDto } from '../../../shared/dtos/request/update-documento.dto';
import { CriarDocumentoDto } from '../../../shared/dtos/request/criar-documento.dto';
import { GerarNumeracaoDto } from '../../../shared/dtos/request/gerar-numeracao.dto';
import { TipoDocumento } from '../../../shared/interfaces/tipo-documento.interface';
import { CreateTipoDocumentoDto } from '../../../shared/dtos/request/criar-tipo-documento.dto';

export interface Documento {
  id: number;
  nome: string;
  contador: number;
}

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private apiUrl = `${environment.apiUrl}/documentos`;
  // 1. O BehaviorSubject armazena a lista atual e a envia para os ouvintes
  private documentosSubject = new BehaviorSubject<DocumentoResponseDto[]>([]);

  // 2. O Observable público (os componentes assinam este)
  public ultimosDocumentos$: Observable<DocumentoResponseDto[]> =
    this.documentosSubject.asObservable();

  constructor(private http: HttpClient) {}

  listarDocumentos(): Observable<Documento[]> {
    return this.http.get<Documento[]>(this.apiUrl);
  }
  buscarPorId(id: number): Observable<DocumentoResponseDto> {
    return this.http.get<DocumentoResponseDto>(
      `${this.apiUrl}/documentos/${id}`
    );
  }
  atualizarDocumento(
    id: number,
    documento: UpdateDocumentoDto
  ): Observable<DocumentoResponseDto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<DocumentoResponseDto>(url, documento);
  }

  deletarDocumento(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  criarDocumento(
    documento: CriarDocumentoDto
  ): Observable<DocumentoResponseDto> {
    return this.http.post<DocumentoResponseDto>(this.apiUrl, documento);
  }

  gerarNumeracao(
    dadosGeracao: GerarNumeracaoDto
  ): Observable<DocumentoResponseDto> {
    const url = `${this.apiUrl}/gerar`;
    return this.http.post<DocumentoResponseDto>(url, dadosGeracao);
  }

  public buscarUltimosDocumentos(): Observable<DocumentoResponseDto[]> {
    const url = `${this.apiUrl}/ultimos`;
    return this.http.get<DocumentoResponseDto[]>(url).pipe(
      // Atualiza o BehaviorSubject com a lista fresca do servidor
      tap((data) => this.documentosSubject.next(data))
    );
  }

  public recarregarListaUltimosDocumentos(): void {
    // Chama a busca, que por sua vez, atualiza o Subject.
    this.buscarUltimosDocumentos().subscribe({
      error: (err) => console.error('Erro ao recarregar lista:', err),
    });
  }

  atualizarTipoDocumento(
    id: number,
    tipoDocumento: TipoDocumento
  ): Observable<TipoDocumento> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<TipoDocumento>(url, tipoDocumento);
  }

  deletarTipoDocumento(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  listarTodosTiposDocumentos(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.apiUrl);
  }

  criarTipoDocumento(
    tipoDocumento: CreateTipoDocumentoDto
  ): Observable<TipoDocumento> {
    return this.http.post<TipoDocumento>(this.apiUrl, tipoDocumento);
  }

  alterarStatusTipoDocumento(
    id: number,
    status: Status
  ): Observable<TipoDocumento> {
    const url = `${this.apiUrl}/${id}/status?status=${status}`;
    // A requisição PATCH não precisa de corpo (body) para esta chamada
    return this.http.patch<TipoDocumento>(url, null);
  }

  listarTiposDocumentosAtivos(): Observable<TipoDocumento[]> {
    const url = `${this.apiUrl}/ativos`;
    return this.http.get<TipoDocumento[]>(url);
  }
}

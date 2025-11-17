//dependências externas
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Status } from '../../../shared/enums/documents-enums';

//dependências locais
import { Cartorio } from '../../../shared/interfaces/cartorio.interface';
import { Documento } from '../../../shared/interfaces/documento.interface';
import { DocumentoResponseDto } from '../../../shared/dtos/response/documento-response.dto';
import { UpdateDocumentoDto } from '../../../shared/dtos/request/update-documento.dto';
import { CriarDocumentoDto } from '../../../shared/dtos/request/criar-documento.dto';
import { GerarNumeracaoDto } from '../../../shared/dtos/request/gerar-numeracao.dto';
import { TipoDocumento } from '../../../shared/interfaces/tipo-documento.interface';
import { CreateTipoDocumentoDto } from '../../../shared/dtos/request/criar-tipo-documento.dto';
import { CartorioCadastroDto } from '../../../shared/dtos/request/cartorio-cadastro.dto';

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private apiUrl = `${environment.apiUrl}/documentos`;
  private apiCartorioUrl = `${environment.apiUrl}/cartorios`;
  // 1. O BehaviorSubject armazena a lista atual e a envia para os ouvintes
  private documentosSubject = new BehaviorSubject<DocumentoResponseDto[]>([]);

  // 2. O Observable público (os componentes assinam este)
  public ultimosDocumentos$: Observable<DocumentoResponseDto[]> =
    this.documentosSubject.asObservable();

  constructor(private http: HttpClient) {}

  public cadastrarCartorio(dto: CartorioCadastroDto): Observable<any> {
    const url = this.apiCartorioUrl;
    console.log('API POST: Cadastrar Cartório', dto);
    return this.http.post<any>(url, dto);
  }

  public listarCartoriosAtivos(): Observable<Cartorio[]> {
    const url = `${this.apiCartorioUrl}/ativos`; // URL provável
    // return this.http.get<Cartorio[]>(url); // Chamada HTTP real

    // Mock para testes, remova em produção:
    return of([
      { id: 1, nome: 'Primeiro Cartório de Notas', cartorioAtivo: true },
      { id: 2, nome: 'Registro Civil - Zona Oeste', cartorioAtivo: true },
    ] as Cartorio[]);
  }

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

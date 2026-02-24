//dependências externas
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
import { TipoDocumentoDTO } from '../../../shared/dtos/response/documento-response.dto';
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
      `${this.apiUrl}/documentos/${id}`,
    );
  }
  atualizarDocumento(
    id: number,
    documento: UpdateDocumentoDto,
  ): Observable<DocumentoResponseDto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<DocumentoResponseDto>(url, documento);
  }

  deletarDocumento(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  criarDocumento(
    documento: CriarDocumentoDto,
  ): Observable<DocumentoResponseDto> {
    return this.http.post<DocumentoResponseDto>(this.apiUrl, documento);
  }

  gerarNumeracao(
    dadosGeracao: GerarNumeracaoDto,
  ): Observable<DocumentoResponseDto> {
    const url = `${this.apiUrl}/gerar`;
    return this.http.post<DocumentoResponseDto>(url, dadosGeracao);
  }

  public buscarUltimosDocumentos(): Observable<DocumentoResponseDto[]> {
    const url = `${this.apiUrl}/ultimos`;
    return this.http.get<DocumentoResponseDto[]>(url).pipe(
      // Atualiza o BehaviorSubject com a lista fresca do servidor
      tap((data) => this.documentosSubject.next(data)),
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
    tipoDocumento: TipoDocumento,
  ): Observable<TipoDocumento> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<TipoDocumento>(url, tipoDocumento);
  }

  deletarTipoDocumento(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
  /*
  listarTodosTiposDocumentos(): Observable<{ content: TipoDocumentoDTO[] }> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        // O 'map' aqui serve para "limpar" o que vem do Java
        res.content = res.content.map((item: any) => {
          res.content = res.content.map((item: any) => {
            return {
              id: item.id,
              // Se nomeTipoDocumento vier null, ele tenta pegar 'nome'.
              // Se ambos forem null, ele coloca 'Sem Nome' para você ver algo na tela.
              nome: item.nomeTipoDocumento || item.nome || 'Documento sem nome',

              // Se o status vier null do Java, definimos um padrão para o switch não quebrar
              status: item.status ? (item.status as Status) : Status.INATIVO,
            } as TipoDocumentoDTO;
          });
        });
        return res;
      }),
    );
  }
*/

  listarTodosTiposDocumentos(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        // Determina qual é a lista de itens (seja paginada ou array direto)
        let itens =
          res && res.content ? res.content : Array.isArray(res) ? res : [];

        // Normaliza os itens
        itens = itens.map((item: any) => ({
          ...item,
          nome:
            item.nome || item.nomeTipoDocumento || `Documento ID ${item.id}`,
          status:
            item.status || (item.tipoDocumentoAtivo ? 'ATIVO' : 'INATIVO'),
        }));

        // Retorna estrutura compatível com o componente (sempre com .content)
        if (res && res.content) {
          res.content = itens;
          return res;
        }
        return { content: itens };
      }),
    );
  }
  criarTipoDocumento(
    tipoDocumento: CreateTipoDocumentoDto,
  ): Observable<TipoDocumento> {
    return this.http.post<TipoDocumento>(this.apiUrl, tipoDocumento);
  }

  alterarStatusTipoDocumento(
    id: number,
    status: Status,
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

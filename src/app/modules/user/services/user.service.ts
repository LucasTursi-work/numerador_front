import { PerfilUsuario, StatusUsuario } from '../../../shared/enums/user-enums';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { CreateUsuarioRequestDTO } from '../../../shared/dtos/request/create-user.dto';
import {
  UsuarioResponseDTO,
  UsuariosPaginadosResponse,
} from '../../../shared/dtos/response/usuario-response.dto';
import { BuscarUsuariosParams } from '../../../shared/dtos/request/usuario-params.dto';
import { environment } from '../../../../environments/environment';
import { AlterarSenhaRequestDTO } from '../../../shared/dtos/request/alterar-senha.dto';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly API = `${environment.apiUrl}/usuarios`;

  private usuariosSubject$ = new BehaviorSubject<any[]>([]);
  public usuarios$ = this.usuariosSubject$.asObservable();

  constructor(private http: HttpClient) {}

  criarUsuario(dto: CreateUsuarioRequestDTO): Observable<UsuarioResponseDTO> {
    // Remove campos opcionais não preenchidos (evita envio de 'undefined')
    const body = {
      ...dto,
      Status: dto.status || StatusUsuario.ATIVO, // Valor padrão
    };

    return this.http.post<UsuarioResponseDTO>(`${this.API}`, body);
  }

  deletarUsuario(id: number): Observable<void> {
    // Este método envia uma requisição DELETE para o backend
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  patchUsuario(
    id: number,
    dados: Partial<UsuarioResponseDTO>,
  ): Observable<UsuarioResponseDTO> {
    // A data de atualização pode ser gerada no momento do envio
    const payload = {
      ...dados,
      dataAtualizacao: new Date().toISOString(),
    };
    return this.http.patch<UsuarioResponseDTO>(`${this.API}/${id}`, payload);
  }

  alterarSenha(dados: AlterarSenhaRequestDTO): Observable<string> {
    return this.http.post<string>(`${this.API}/alterar-senha`, dados);
  }

  buscarUsuario(
    valor: string | number,
    tipo: 'id' | 'cpf' | 'nome',
    page: number = 0,
    size: number = 10,
    sort: string = '',
  ): Observable<any> {
    // Tipo para any ou UsuarioResponseDTO para aceitar objeto direto
    let url = '';

    switch (tipo) {
      case 'id':
        url = `${this.API}/${valor}/json`;
        return this.http.get<UsuarioResponseDTO>(url);

      case 'cpf':
        url = `${this.API}/cpf/${valor}`;
        return this.http.get<UsuarioResponseDTO>(url);

      case 'nome':
        url = `${this.API}/buscarPorNome?nome=${valor}&page=${page}&size=${size}`;
        if (sort) url += `&sort=${sort}`;
        return this.http.get<UsuarioResponseDTO[]>(url);

      default:
        throw new Error('Tipo de busca inválido');
    }
  }

  listarUsuarios(
    params: BuscarUsuariosParams,
  ): Observable<UsuariosPaginadosResponse> {
    let httpParams = new HttpParams();
    // Adiciona parâmetros não nulos/undefined
    if (params.nome) httpParams = httpParams.append('nome', params.nome);
    if (params.cpf) httpParams = httpParams.append('cpf', params.cpf);
    if (params.status) httpParams = httpParams.append('status', params.status);
    if (params.perfil) httpParams = httpParams.append('perfil', params.perfil);
    if (params.pagina)
      httpParams = httpParams.append('page', params.pagina.toString());
    if (params.limite)
      httpParams = httpParams.append('size', params.limite.toString());
    if (params.ordenacao)
      httpParams = httpParams.append('sort', params.ordenacao);
    console.log('Requisição GET para:', `${this.API}?${httpParams.toString()}`);
    console.warn('⚠️ Método antigo listarUsuarios() FOI CHAMADO!');
    return this.http.get<any>(this.API, {
      params: httpParams,
    });
  }

  listarUsuariosPaginado(parametros: any): Observable<any> {
    //altera a url para a que retorna os usuários com paginação
    let httpParams = new HttpParams();
    if (parametros.nome) httpParams = httpParams.set('nome', parametros.nome);
    if (parametros.cpf) httpParams = httpParams.set('cpf', parametros.cpf);
    if (parametros.perfil)
      httpParams = httpParams.set('perfil', parametros.perfil);
    if (parametros.status)
      httpParams = httpParams.set('status', parametros.status);
    const page = parametros.pagina ?? 0;
    const size = parametros.limite ?? 15;
    httpParams = httpParams.set('page', page).set('size', size);

    console.log(
      'Requisição GET para:',
      `${this.API}/filtrar?${httpParams.toString()}`,
    );

    return this.http.get(`${this.API}/filtrar`, { params: httpParams });
  }

  public carregarUsuarios(): void {
    // Criamos o objeto seguindo à risca a interface BuscarUsuariosParams
    const parametrosFiltro: BuscarUsuariosParams = {
      status: StatusUsuario.ATIVO, // Usa o Enum exigido para evitar erro de tipo
      pagina: 0,
      limite: 999, // Traz um universo amplo para não cortar nomes no dropdown
    };

    // Chamamos o método antigo que bate na rota raiz (/usuarios), resolvendo o 401!
    this.listarUsuarios(parametrosFiltro).subscribe({
      next: (res: any) => {
        // Como o Spring Boot devolve uma estrutura Page do org.springframework.data.domain, pegamos o .content
        const lista = res.content || (Array.isArray(res) ? res : []);
        this.usuariosSubject$.next(lista);
      },
      error: (err) => {
        console.error(
          'Erro ao carregar universo de usuários ativos via listarUsuarios():',
          err,
        );
      },
    });
  }
}

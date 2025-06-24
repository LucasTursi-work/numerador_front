import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUsuarioRequestDTO } from '../../../shared/dtos/request/create-user.dto';
import { UsuarioResponseDTO } from '../../../shared/dtos/response/usuario-response.dto';
import { ListarUsuariosParams } from '../../../shared/dtos/request/usuario-params.dto';
import { environment } from '../../../../environments/environment';
import { StatusUsuario } from '../../../shared/enums/user-enums';
import { AlterarSenhaRequestDTO } from '../../../shared/dtos/request/alterar-senha.dto';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  criarUsuario(dto: CreateUsuarioRequestDTO): Observable<UsuarioResponseDTO> {
    // Remove campos opcionais não preenchidos (evita envio de 'undefined')
    const body = {
      ...dto,
      status: dto.status || StatusUsuario.ATIVO, // Valor padrão
    };

    return this.http.post<UsuarioResponseDTO>(this.apiUrl, body);
  }

  deletarUsuario(id: number): Observable<void> {
    // Este método envia uma requisição DELETE para o backend
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarUsuarios(
    params?: ListarUsuariosParams
  ): Observable<UsuarioResponseDTO[]> {
    let httpParams = new HttpParams();

    if (params) {
      httpParams = httpParams
        .set('pagina', params.pagina.toString())
        .set('limite', params.limite.toString());
      /*
      if (params.ordenacao) {
        httpParams = httpParams.set('ordenacao', params.ordenacao);
      }
*/
      if (params.filtro) {
        httpParams = httpParams.set('filtro', params.filtro);
      }
    }

    return this.http.get<UsuarioResponseDTO[]>(this.apiUrl, {
      params: httpParams,
    });
  }
  alterarSenha(dados: AlterarSenhaRequestDTO): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/alterar-senha`, dados);
  }
  buscarUsuario(
    valor: string | number,
    tipo: 'id' | 'cpf' | 'nome'
  ): Observable<UsuarioResponseDTO> {
    let url = '';

    switch (tipo) {
      case 'id':
        url = `${this.apiUrl}/${valor}/json`;
        break;
      case 'cpf':
        url = `${this.apiUrl}/cpf/${valor}`;
        break;
      case 'nome':
        url = `${this.apiUrl}/nome/${valor}`;
        break;
      default:
        throw new Error('Tipo de busca inválido');
    }

    return this.http.get<UsuarioResponseDTO>(url);
  }
}

/*
*UTILIZAR ISTO NUM COMPONENTE PARA RODAR A FUNÇÃO DE BUSCA POR JSON DO buscarUsuarioPorID
==========================
this.usuarioService.buscarUsuarioPorId(3).subscribe({
  next: (usuario) => {
    console.log('Usuário encontrado:', usuario);
    this.usuario = usuario; // ou preencher um formulário
  },
  error: () => {
    alert('Usuário não encontrado!');
  }
});
============================
*/

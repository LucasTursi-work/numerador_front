import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequestDto } from '../../shared/dtos/request/login-request.dto';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';
import { StatusUsuario, PerfilUsuario } from '../../shared/enums/user-enums';

interface UsuarioLogadoState {
  id: number | null;
  nome: string | null;
  perfil: PerfilUsuario | null;
  status: StatusUsuario | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://sua-api.com/api/login'; // Endpoint específico para login

  // 1. O BehaviorSubject para gerenciar o estado global do usuário
  private usuarioLogadoSubject = new BehaviorSubject<UsuarioLogadoState>({
    id: null,
    nome: null,
    perfil: null,
    status: null,
  });

  // Observable público para outros componentes se inscreverem
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credenciais: LoginRequestDto): Observable<UsuarioResponseDTO> {
    // 1. Faz a chamada HTTP para o backend
    return this.http.post<UsuarioResponseDTO>(this.apiUrl, credenciais).pipe(
      // 2. Usa 'tap' para fazer um efeito colateral (salvar o estado)
      tap((resposta: UsuarioResponseDTO) => {
        // 3. Atualiza o BehaviorSubject com os dados do usuário
        this.usuarioLogadoSubject.next({
          id: resposta.id,
          nome: resposta.nome,
          perfil: resposta.perfil,
          status: resposta.status,
        });
      })
    );
  }

  isAdminAtivo(): Observable<boolean> {
    return this.usuarioLogado$.pipe(
      map(
        (state) =>
          state.perfil === PerfilUsuario.ADMIN &&
          state.status === StatusUsuario.ATIVO
      )
    );
  }

  getUsuarioLogadoId(): Observable<number | null> {
    // Retorna o ID do objeto de estado
    return this.usuarioLogado$.pipe(map((state) => state.id));
  }
  logout(): void {
    this.usuarioLogadoSubject.next({
      id: null,
      nome: null, // ⚠️ Reseta o nome para null
      perfil: null,
      status: null,
    });
  }
}

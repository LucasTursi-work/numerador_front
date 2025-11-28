import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequestDto } from '../../shared/dtos/request/login-request.dto';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';
import { StatusUsuario, PerfilUsuario } from '../../shared/enums/user-enums';
import { environment } from '../../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/login`; // Endpoint específico para login

  // 1. O BehaviorSubject para gerenciar o estado global do usuário
  private usuarioLogadoSubject = new BehaviorSubject<UsuarioLogadoState>({
    id: null,
    nome: null,
    perfil: null,
    status: null,
  });

  // Observable público para outros componentes se inscreverem
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      // Assumindo que você armazena o token sob a chave 'jwt_token'
      return localStorage.getItem('jwt_token');
    }
    return null;
  }
  getUsuarioLogadoId(): Observable<number | null> {
    // Retorna o ID do objeto de estado
    return this.usuarioLogado$.pipe(map((state) => state.id));
  }
  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      this.usuarioLogadoSubject.next({
        id: null,
        nome: null, // ⚠️ Reseta o nome para null
        perfil: null,
        status: null,
      });
    }
  }
}

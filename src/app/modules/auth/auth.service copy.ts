import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { LoginRequestDto } from '../../shared/dtos/request/login-request.dto';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';
import { LoginResponseDto } from '../../shared/dtos/response/login-response.dto';
import { StatusUsuario, PerfilUsuario } from '../../shared/enums/user-enums';
import { environment } from '../../../environments/environment';

interface UsuarioLogadoState {
  id: number | null;
  nome: string | null;
  perfil: PerfilUsuario | null;
  status: StatusUsuario | null;
  cpf?: string | null;
  email?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;
  private userApiUrl = `${environment.apiUrl}/usuarios/me`;

  private usuarioLogadoSubject = new BehaviorSubject<UsuarioLogadoState>({
    id: null,
    nome: null,
    perfil: null,
    status: null,
  });

  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.recuperarEstadoUsuario();
  }

  // ============ MÉTODOS PÚBLICOS PRINCIPAIS ============

  public login(credenciais: LoginRequestDto): Observable<UsuarioResponseDTO> {
    const loginApiUrl = `${environment.apiUrl}/login`;

    // 1. Chama o endpoint de Login (POST /api/login)
    return this.http.post<LoginResponseDto>(loginApiUrl, credenciais).pipe(
      // 2. Salva o Token no localStorage
      tap((resposta: LoginResponseDto) => {
        if (isPlatformBrowser(this.platformId)) {
          // A chave 'jwt_token' é usada aqui E em getToken(). OK.
          localStorage.setItem('jwt_token', resposta.token);
        }
      }),
      // 3. Usa switchMap para ENVIAR o token recém-salvo para a chamada /me
      switchMap(() => {
        // userApiUrl é: ${environment.apiUrl}/usuarios/me
        // Essa chamada VAI usar o token que acabou de ser salvo, via AuthInterceptor
        return this.http.get<UsuarioResponseDTO>(this.userApiUrl);
      }),
      // 4. Se /me for bem-sucedido, atualiza o Subject e retorna o objeto Usuario
      tap((usuario: UsuarioResponseDTO) => {
        this.atualizarUsuarioLogado(usuario); // Popula o BehaviorSubject com os dados do /me
      }),
      // Captura erros de autenticação (401) ou outros
      catchError((error) => {
        // Limpa o token se /me falhar, evitando tokens inválidos no localStorage
        this.limparToken();
        return throwError(() => error);
      })
    );
  }

  private limparToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
    }
  }
  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('usuario_state');
      this.usuarioLogadoSubject.next({
        id: null,
        nome: null,
        perfil: null,
        status: null,
      });
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  public isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('jwt_token');
    }
    return false;
  }

  public obterDadosUsuarioLogado(): Observable<UsuarioLogadoState> {
    return this.http.get<UsuarioResponseDTO>(this.userApiUrl).pipe(
      tap((usuario: UsuarioResponseDTO) => {
        const novoEstado: UsuarioLogadoState = {
          id: usuario.id,
          nome: usuario.nome,
          perfil: usuario.perfil as PerfilUsuario,
          status: usuario.status as StatusUsuario,
          cpf: usuario.cpf,
          email: usuario.email,
        };

        this.usuarioLogadoSubject.next(novoEstado);
        this.salvarEstadoUsuario(novoEstado);
      }),
      map(() => this.usuarioLogadoSubject.value),
      catchError((error) => {
        console.error('Erro ao obter dados do usuário:', error);
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => error);
      })
    );
  }

  public inicializarAutenticacao(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('Não autenticado'));
    }

    return this.obterDadosUsuarioLogado().pipe(
      map(() => true),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  // ============ MÉTODOS PÚBLICOS DE CONSULTA ============

  public getUsuarioLogadoId(): Observable<number | null> {
    return this.usuarioLogado$.pipe(map((state) => state.id));
  }

  public getUsuarioLogado(): UsuarioLogadoState {
    return this.usuarioLogadoSubject.value;
  }

  public hasPerfil(perfil: PerfilUsuario): Observable<boolean> {
    return this.usuarioLogado$.pipe(map((state) => state.perfil === perfil));
  }

  public hasStatus(status: StatusUsuario): Observable<boolean> {
    return this.usuarioLogado$.pipe(map((state) => state.status === status));
  }

  public isAdminAtivo(): Observable<boolean> {
    return this.usuarioLogado$.pipe(
      map(
        (state) =>
          state.perfil === PerfilUsuario.ADMIN &&
          state.status === StatusUsuario.ATIVO
      )
    );
  }

  // ============ MÉTODOS PÚBLICOS DE ATUALIZAÇÃO ============

  public atualizarUsuarioLogado(usuario: Partial<UsuarioLogadoState>): void {
    const estadoAtual = this.usuarioLogadoSubject.value;
    const novoEstado = { ...estadoAtual, ...usuario };
    this.usuarioLogadoSubject.next(novoEstado);
    this.salvarEstadoUsuario(novoEstado);
  }

  // ============ MÉTODOS PRIVADOS ============

  private recuperarEstadoUsuario(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = localStorage.getItem('usuario_state');
      if (storedState) {
        try {
          const state = JSON.parse(storedState);
          this.usuarioLogadoSubject.next(state);
        } catch (e) {
          console.error('Erro ao recuperar estado:', e);
          this.limparEstado();
        }
      }
    }
  }

  private salvarEstadoUsuario(state: UsuarioLogadoState): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('usuario_state', JSON.stringify(state));
    }
  }

  private limparEstado(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuario_state');
    }
    this.usuarioLogadoSubject.next({
      id: null,
      nome: null,
      perfil: null,
      status: null,
    });
  }
}

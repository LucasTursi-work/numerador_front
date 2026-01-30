import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequestDto } from '../../shared/dtos/request/login-request.dto';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';
import { StatusUsuario, PerfilUsuario } from '../../shared/enums/user-enums';
import { LoginResponseDto } from '../../shared/dtos/response/login-response.dto';
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

  login(credenciais: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(this.apiUrl, credenciais).pipe(
      tap((resposta: LoginResponseDto) => {
        // 1. VERIFICAÇÃO DE SEGURANÇA PARA SSR (Angular 18)
        if (isPlatformBrowser(this.platformId)) {
          // 2. SALVA O TOKEN (O interceptor vai ler 'jwt_token' aqui)
          localStorage.setItem('jwt_token', resposta.token);
          localStorage.setItem('usuarioId', resposta.usuarioId.toString());

          console.log('Token salvo com sucesso no LocalStorage!');
        }

        // 3. ATUALIZA O ESTADO (Para os componentes saberem quem logou)
        this.usuarioLogadoSubject.next({
          id: resposta.usuarioId,
          nome: resposta.nome || 'Usuário',
          perfil: resposta.perfil as any,
          status: resposta.status as any,
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

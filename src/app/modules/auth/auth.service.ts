import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequestDto } from '../../shared/dtos/request/login-request.dto';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';
import { StatusUsuario, PerfilUsuario } from '../../shared/enums/user-enums';


interface UsuarioLogadoState {
  id: number | null;
  perfil: PerfilUsuario | null;
  ativo: StatusUsuario | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://sua-api.com/api/login'; // Endpoint específico para login

  // 1. O BehaviorSubject para gerenciar o estado global do usuário
  private usuarioLogadoSubject = new BehaviorSubject<UsuarioLogadoState>({
    id: null,
    perfil: null,
    status: null,
  });
  
  // Observable público para outros componentes se inscreverem
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credenciais: LoginRequestDto): Observable<UsuarioResponseDTO> {
    return this.usuarioLogado$.pipe(
      map(state)=> state.perfil ===PerfilUsuario.ADMIN && state.status === StatusUsuario.ATIVO
    )
  );
}


  getUsuarioLogadoId(): Observable<number> {
    // ⚠️ SUBSTITUIR PELA LÓGICA REAL: (extrair ID do token ou LocalStorage)
    // Por enquanto, retorna um ID mockado (1) para não quebrar o código
    return of(1);
  }
}

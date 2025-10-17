import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoginRequestDto } from '../../shared/dtos/request/login-request.dto';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://sua-api.com/api/login'; // Endpoint específico para login

  constructor(private http: HttpClient) {}

  login(credenciais: LoginRequestDto): Observable<UsuarioResponseDTO> {
    return this.http.post<UsuarioResponseDTO>(this.apiUrl, credenciais);
  }

  getUsuarioLogadoId(): Observable<number> {
    // ⚠️ SUBSTITUIR PELA LÓGICA REAL: (extrair ID do token ou LocalStorage)
    // Por enquanto, retorna um ID mockado (1) para não quebrar o código
    return of(1);
  }
}

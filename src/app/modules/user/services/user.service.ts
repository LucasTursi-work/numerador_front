import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUsuarioRequestDTO, UsuarioResponseDTO } from '../models/dtos';

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
}

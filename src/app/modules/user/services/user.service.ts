import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUsuarioRequestDTO } from '../../../shared/dtos/request/create-user.dto';
import { UsuarioResponseDTO } from '../../../shared/dtos/response/usuario-response.dto';
import { environment } from '../../../../environments/environment';
import { StatusUsuario } from '../../../shared/enums/user-enums';

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

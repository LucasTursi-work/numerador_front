import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DocumentoResponseDTO } from '../../../shared/dtos/response/documento-response.dto';

export interface Documento {
  id: number;
  nome: string;
  contador: number;
}

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private apiUrl = `${environment.apiUrl}/documentos`; // ou outro endpoint correto

  constructor(private http: HttpClient) {}

  listarDocumentos(): Observable<Documento[]> {
    return this.http.get<Documento[]>(this.apiUrl);
  }
  buscarPorId(id: number): Observable<DocumentoResponseDTO> {
    return this.http.get<DocumentoResponseDTO>(
      `${this.apiUrl}/documentos/${id}`
    );
  }
}

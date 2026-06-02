import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CartorioDTO } from '../../shared/dtos/response/cartorio-response.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartorioService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cartorios`;

  // Gerenciador de estado reativo privado
  private cartoriosSubject$ = new BehaviorSubject<CartorioDTO[]>([]);

  // Exposição pública como Observable para os componentes assinarem
  public cartorios$ = this.cartoriosSubject$.asObservable();

  constructor() {}

  public carregarCartorios(): void {
    this.http.get<CartorioDTO[]>(this.apiUrl).subscribe({
      next: (dados) => this.cartoriosSubject$.next(dados),
      error: (err) => console.error('Erro ao buscar cartórios:', err),
      // O interceptor JWT cuidará do Bearer Token automaticamente aqui
    });
  }

  /**
   * Exemplo de ação de escrita (Alternar status ativo/inativo)
   */
  public alternarStatus(id: number): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/${id}/status`, {}) // Mudou de /alternar-status para /status
      .pipe(
        tap(() => {
          this.carregarCartorios();
        }),
      );
  }

  deletarCartorio(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}

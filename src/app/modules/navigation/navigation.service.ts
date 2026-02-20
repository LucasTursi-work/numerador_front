import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CriarCartorioComponent } from '../../components/criar-cartorio/criar-cartorio.component';
import { CriarTipoDocumentoComponent } from '../../components/criar-tipo-documento/criar-tipo-documento.component';

// Tipos de modal para evitar strings soltas
export type TipoModal = 'documento' | 'cartorio';

@Injectable({
  providedIn: 'root', // Disponível globalmente (Standalone friendly)
})
export class ModalComunicacaoService {
  // O Subject é o "sino" que emite o evento
  private modalRequest = new Subject<TipoModal>();

  // O Observable é o "ouvinte" que outros componentes assinam
  modalRequest$ = this.modalRequest.asObservable();

  constructor() {}

  // Método que o MenuLateralComponent irá chamar
  abrirModal(tipo: TipoModal): void {
    this.modalRequest.next(tipo);
  }
}

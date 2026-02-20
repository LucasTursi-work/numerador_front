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
  constructor(private modalService: NgbModal) {} // Injetamos o NgbModal aqui

  abrirModal(tipo: TipoModal): void {
    if (tipo === 'cartorio') {
      this.modalService.open(CriarCartorioComponent, {
        size: 'lg',
        backdrop: 'static',
      });
    } else if (tipo === 'documento') {
      this.modalService.open(CriarTipoDocumentoComponent, { size: 'md' });
    }
  }
}

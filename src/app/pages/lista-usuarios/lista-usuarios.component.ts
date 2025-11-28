import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListaUsuariosContentComponent } from '../../components/lista-usuarios-content/lista-usuarios-content.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CriarCartorioComponent } from '../../components/criar-cartorio/criar-cartorio.component';
import { CriarTipoDocumentoComponent } from '../../components/criar-tipo-documento/criar-tipo-documento.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { NumeradorService } from '../../components/dashboard/numerador.service';
import { Subscription } from 'rxjs';
import {
  ModalComunicacaoService,
  TipoModal,
} from '../../modules/navigation/navigation.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    ListaUsuariosContentComponent,
    MenuLateralComponent,
    HeaderComponent,
    CriarCartorioComponent,
    CriarTipoDocumentoComponent,
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss',
})
export class ListaUsuariosComponent implements OnInit, OnDestroy {
  private modalSubscription!: Subscription;

  constructor(
    private modalService: NgbModal,
    private modalComService: ModalComunicacaoService,
    private documentsService: DocumentoService,
    private numeradorService: NumeradorService
  ) {}

  ngOnInit() {
    // Estrutura de Assinatura OK: Delega a chamada para funções específicas
    this.modalSubscription = this.modalComService.modalRequest$.subscribe(
      (tipo) => {
        if (tipo === 'cartorio') {
          this.abrirModalCartorio();
        } else if (tipo === 'documento') {
          this.abrirModalDocumento();
        }
      }
    );
  }

  private abrirModalCartorio() {
    const modalRef = this.modalService.open(CriarCartorioComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          console.log(`Cadastro de cartório realizado com sucesso.`);
          // LÓGICA DE RECARREGAMENTO DE DADOS AQUI
        }
      },
      () => {
        // Modal descartado
      }
    );
  }

  // Implementação da função específica para Tipo de Documento
  private abrirModalDocumento() {
    const modalRef = this.modalService.open(CriarTipoDocumentoComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          console.log(`Cadastro de documento realizado com sucesso.`);
          // LÓGICA DE RECARREGAMENTO DE DADOS
        }
      },
      () => {
        // Modal descartado
      }
    );
  }

  ngOnDestroy() {
    // Limpeza obrigatória para evitar vazamento de memória
    this.modalSubscription.unsubscribe();
  }
}

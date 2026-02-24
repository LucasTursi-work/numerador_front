import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import {
  ModalComunicacaoService,
  TipoModal,
} from '../../modules/navigation/navigation.service';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { NumeradorService } from '../../components/dashboard/numerador.service';

// Component Imports
import { NumeradorComponent } from '../../components/dashboard/numerador/numerador.component';
import { GraficosComponent } from '../../components/dashboard/graficos/graficos.component';
import { LogsComponent } from '../../components/dashboard/logs/logs.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CriarCartorioComponent } from '../../components/criar-cartorio/criar-cartorio.component';
import { CriarTipoDocumentoComponent } from '../../components/criar-tipo-documento/criar-tipo-documento.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MenuLateralComponent,
    NumeradorComponent,
    GraficosComponent,
    LogsComponent,
    HeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  //private modalSubscription!: Subscription;

  constructor(
    private modalService: NgbModal,
    private modalComService: ModalComunicacaoService,
    private documentsService: DocumentoService,
    private numeradorService: NumeradorService,
  ) {}

  ngOnInit() {}

  // Implementação da função específica para Cartório
  private abrirModalCartorio() {
    const modalRef = this.modalService.open(CriarCartorioComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          console.log(`Cadastro de cartório realizado com sucesso.`);
          // LÓGICA DE RECARREGAMENTO DE DADOS
        }
      },
      () => {
        // Modal descartado
      },
    );
  }

  //Implementação da função específica para Tipo de Documento
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
      },
    );
  }

  ngOnDestroy() {}
}

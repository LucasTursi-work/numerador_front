import { Component, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { TabelaDocumentosComponent } from '../../components/tabela-documentos/tabela-documentos.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ModalEditarTipoDocComponent } from '../../components/modal-editar-tipo-doc/modal-editar-tipo-doc.component';
import { TipoDocumentoDTO } from '../../shared/dtos/response/documento-response.dto';
import { Status } from '../../shared/enums/documents-enums';

@Component({
  selector: 'app-tipos-de-documento',
  templateUrl: './tipos-de-documento.component.html',
  styleUrls: ['./tipos-de-documento.component.scss'],
  imports: [
    CommonModule,
    TabelaDocumentosComponent,
    MenuLateralComponent,
    HeaderComponent,
  ],
  standalone: true,
})
export class TiposDeDocumentoComponent {}

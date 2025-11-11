import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CriarCartorioComponent } from '../criar-cartorio/criar-cartorio.component';
import { CriarTipoDocumentoComponent } from '../criar-tipo-documento/criar-tipo-documento.component';
import {
  ModalComunicacaoService,
  TipoModal,
} from '../../modules/navigation/navigation.service';
@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss',
})
export class MenuLateralComponent {
  constructor(
    private router: Router,
    private modalComService: ModalComunicacaoService
  ) {}
  navDashboard() {
    this.router.navigate(['/dashboard']);
  }
  navListaUsuarios() {
    this.router.navigate(['/listaUsuarios']);
  }
  navModalDocumento() {
    this.modalComService.abrirModal('documento');
  }
  navModalCartorio() {
    this.modalComService.abrirModal('cartorio');
  }
  navLogOut() {
    this.router.navigate(['']);
  }
}

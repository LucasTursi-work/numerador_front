import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-criar-cartorio',
  standalone: true,
  imports: [],
  templateUrl: './criar-cartorio.component.html',
  styleUrl: './criar-cartorio.component.scss',
})
export class CriarCartorioComponent {
  constructor(public activeModal: NgbActiveModal) {}

  salvarECadastrar() {}

  cancelar() {
    this.activeModal.dismiss('cancel');
  }
}

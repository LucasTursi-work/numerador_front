import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoDocumento } from '../../shared/interfaces/tipo-documento.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-editar-tipo-doc',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-editar-tipo-doc.component.html',
  styleUrl: './modal-editar-tipo-doc.component.scss',
})
export class ModalEditarTipoDocComponent {
  activeModal = inject(NgbActiveModal);
  @Input() tipo!: TipoDocumento;

  salvar() {
    // Retornamos o objeto alterado para o componente pai
    this.activeModal.close(this.tipo);
  }
}

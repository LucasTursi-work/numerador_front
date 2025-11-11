import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-criar-tipo-documento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './criar-tipo-documento.component.html',
  styleUrl: './criar-tipo-documento.component.scss',
})
export class CriarTipoDocumentoComponent {
  tipoDocumento: string = '';
  constructor(public activeModal: NgbActiveModal) {
    // O 'public' torna o activeModal acessível no HTML/Template
  }
  cadastrar() {
    // 1. **Implementar a lógica de cadastro aqui (Chamar o serviço de API)**
    console.log(`Cadastrando tipo de documento: ${this.tipoDocumento}`);

    // 2. Fechar o modal com um resultado (e.g., 'success')
    // Isso aciona o .then() na promessa do modalRef.result no DashboardComponent
    this.activeModal.close('success');
  }

  // Opcional: Para fechar o modal sem sucesso (e.g., botão 'Cancelar' ou 'X')
  fecharSemSalvar() {
    this.activeModal.dismiss('cancel');
  }
}

import { Component } from '@angular/core'; // Removido OnInit
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import necessário para *ngIf/ngModel, então mantenha
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { CreateTipoDocumentoDto } from '../../shared/dtos/request/criar-tipo-documento.dto';
import { Status } from '../../shared/enums/documents-enums';

@Component({
  selector: 'app-criar-tipo-documento',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './criar-tipo-documento.component.html',
  styleUrl: './criar-tipo-documento.component.scss',
})
export class CriarTipoDocumentoComponent {
  tipoDocumento: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private documentoService: DocumentoService
  ) {}

  cadastrar() {
    if (!this.tipoDocumento) {
      alert('Por favor, preencha o tipo de documento.');
      return;
    }

    // Construção do DTO completo para o POST
    const dto: CreateTipoDocumentoDto = {
      nome: this.tipoDocumento,
      tipoDocumentoAtivo: true,
    };

    this.documentoService.criarTipoDocumento(dto).subscribe({
      next: (response) => {
        console.log(
          'Cadastro de Tipo de Documento realizado com sucesso:',
          response
        );
        this.activeModal.close('success');
      },
      error: (err) => {
        console.error('Erro ao cadastrar Tipo de Documento:', err);
        alert('Falha ao cadastrar. Verifique o console para detalhes.');
      },
    });
  }

  fecharSemSalvar() {
    this.activeModal.dismiss('cancel');
  }
}

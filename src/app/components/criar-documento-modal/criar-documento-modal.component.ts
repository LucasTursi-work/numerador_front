import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { CriarDocumentoDto } from '../../shared/dtos/request/criar-documento.dto';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-criar-documento-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './criar-documento-modal.component.html',
  styleUrl: './criar-documento-modal.component.scss',
})
export class CriarDocumentoModalComponent {
  // Evento que será emitido quando o modal for fechado
  @Output() modalFechado = new EventEmitter<void>();

  documentoForm: FormGroup;
  isModalVisivel = false;

  constructor(
    private formBuilder: FormBuilder,
    private documentsService: DocumentoService
  ) {
    this.documentoForm = this.formBuilder.group({
      numero: [null, Validators.required],
      // Os campos abaixo devem ser preenchidos com base nas opções do backend (ex: dropdowns)
      usuario: [null, Validators.required],
      tipoDocumento: [null, Validators.required],
      cartorio: [null, Validators.required],
    });
  }

  abrirModal(): void {
    this.isModalVisivel = true;
  }

  fecharModal(): void {
    this.isModalVisivel = false;
    this.modalFechado.emit(); // Notifica o componente pai que o modal foi fechado
  }

  onSubmit(): void {
    if (this.documentoForm.valid) {
      const novoDocumento: CriarDocumentoDto = this.documentoForm.value;

      // Chama o serviço para enviar os dados para o backend
      this.documentsService.criarDocumento(novoDocumento).subscribe({
        next: (resposta) => {
          console.log('Documento criado com sucesso!', resposta);
          alert('Documento criado com sucesso!');
          this.fecharModal();
        },
        error: (erro) => {
          console.error('Erro ao criar documento', erro);
          alert('Ocorreu um erro ao criar o documento.');
        },
      });
    }
  }
}

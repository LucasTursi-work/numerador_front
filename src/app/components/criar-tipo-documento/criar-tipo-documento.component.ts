import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { DocumentoService } from '../../modules/documents/services/documents.service';
//import { UsuarioService } from '../../modules/user/services/user.service';
import { AuthService } from '../../modules/auth/auth.service';
import { Cartorio } from '../../shared/interfaces/cartorio.interface';
import { CreateTipoDocumentoDto } from '../../shared/dtos/request/criar-tipo-documento.dto';
//import { Documento } from '../../shared/models/document.model';
import { Status } from '../../shared/enums/documents-enums';

@Component({
  selector: 'app-criar-tipo-documento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './criar-tipo-documento.component.html',
  styleUrl: './criar-tipo-documento.component.scss',
})
export class CriarTipoDocumentoComponent implements OnInit {
  tipoDocumento: string = '';

  cartorios$!: Observable<Cartorio[]>; // Lista de cartórios para o <select>
  cartorioSelecionadoId: number | null = null; // O ID selecionado pelo usuário
  usuarioIdLogado: number | null = null; // ID do usuário logado

  constructor(
    public activeModal: NgbActiveModal,
    private documentoService: DocumentoService,
    private authService: AuthService
  ) {
    // O 'public' torna o activeModal acessível no HTML/Template
  }

  ngOnInit(): void {}
  cadastrar() {
    if (
      !this.tipoDocumento ||
      !this.cartorioSelecionadoId ||
      !this.usuarioIdLogado
    ) {
      alert('Por favor, preencha todos os campos e tente novamente.');
      return;
    }

    // Construção do DTO completo para o POST
    const dto: CreateTipoDocumentoDto = {
      nome: this.tipoDocumento,
      status: Status.ATIVO,
      cartorioId: this.cartorioSelecionadoId!, // Chave estrangeira
      usuarioCriadorId: this.usuarioIdLogado!, // Chave estrangeira
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

import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { CartorioCadastroDto } from '../../shared/dtos/request/cartorio-cadastro.dto';
import { AuthService } from '../../modules/auth/auth.service';

@Component({
  selector: 'app-criar-cartorio',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './criar-cartorio.component.html',
  styleUrl: './criar-cartorio.component.scss',
})
export class CriarCartorioComponent implements OnInit {
  nomeCartorio: string = '';
  usuarioIdLogado: number | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private documentoService: DocumentoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUsuarioLogadoId().subscribe((id) => {
      //recebe o usuário logado do authService na inicialização
      this.usuarioIdLogado = id;
    });
  }

  salvarECadastrar() {
    if (!this.nomeCartorio || this.usuarioIdLogado === null) {
      alert(
        'Por favor, preencha o nome do cartório e garanta que o usuário esteja logado.'
      );
      return;
    }
    const dto: CartorioCadastroDto = {
      // <--- Usando o DTO específico
      nome: this.nomeCartorio,
      usuarioCriadorId: this.usuarioIdLogado,
      // cartorioAtivo: true, // Opcional: Adicionar se necessário
    };
    this.documentoService.cadastrarCartorio(dto).subscribe({
      next: (response) => {
        console.log('Cadastro de Cartório realizado com sucesso:', response);
        this.activeModal.close('success');
      },
      error: (err) => {
        console.error('Erro ao cadastrar cartório:', err);
        alert('Falha ao cadastrar. Verifique o console para detalhes.');
        this.activeModal.close('error');
      },
    });
  }

  cancelar() {
    this.activeModal.dismiss('cancel');
  }
}

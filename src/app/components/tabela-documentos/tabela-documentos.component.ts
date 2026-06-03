import {
  Component,
  OnInit,
  inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { ModalEditarTipoDocComponent } from '../../components/modal-editar-tipo-doc/modal-editar-tipo-doc.component';
import { TipoDocumentoDTO } from '../../shared/dtos/response/documento-response.dto';
import { Status } from '../../shared/enums/documents-enums';
import { AuthService } from '../../modules/auth/auth.service';

@Component({
  selector: 'app-tabela-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-documentos.component.html',
  styleUrl: './tabela-documentos.component.scss',
})
export class TabelaDocumentosComponent implements OnInit {
  @Input() dados: TipoDocumentoDTO[] = []; // Recebe a lista automaticamente
  @Output() aoEditar = new EventEmitter<TipoDocumentoDTO>();
  @Output() aoExcluir = new EventEmitter<number>();
  @Output() aoMudarStatus = new EventEmitter<TipoDocumentoDTO>();
  private modalService = inject(NgbModal);
  private documentoService = inject(DocumentoService);
  public readonly StatusEnum = Status;
  private authService = inject(AuthService);
  public ehAdmin: boolean = false;
  listaDocumentos: TipoDocumentoDTO[] = [];

  ngOnInit(): void {
    this.carregarDocumentos();
    this.ehAdmin = this.authService.isAdmin();
  }

  // No carregarDocumentos
  carregarDocumentos() {
    this.documentoService.listarTodosTiposDocumentos().subscribe({
      next: (res: any) => {
        // O SEGREDO: res é o objeto Page, res.content é o array de 6 itens
        this.listaDocumentos = res.content || (Array.isArray(res) ? res : []);

        // GARANTIA: Se o HTML estiver usando 'dados' em vez de 'listaDocumentos', isso resolve.
        this.dados = this.listaDocumentos;
        console.log('Itens na variável listaDocumentos:', this.listaDocumentos);
      },
    });
  }

  // No toggleStatus
  toggleStatus(documento: TipoDocumentoDTO) {
    if (!this.ehAdmin) return;

    const novoStatus =
      documento.status === Status.ATIVO ? Status.INATIVO : Status.ATIVO;

    this.documentoService
      .alterarStatusTipoDocumento(documento.id, novoStatus)
      .subscribe({
        next: (docAtualizado: any) => {
          // O map do seu service garante string 'ATIVO' ou 'INATIVO'
          documento.status = docAtualizado.tipoDocumentoAtivo
            ? Status.ATIVO
            : Status.INATIVO;
          console.log('Status alterado no banco com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao mudar status:', err);
          // Força o Angular a redesenhar o template resetando o valor se falhar
          this.carregarDocumentos();
        },
      });
  }

  editar(doc: TipoDocumentoDTO) {
    if (!this.ehAdmin) return;
    const modalRef = this.modalService.open(ModalEditarTipoDocComponent);

    // Passamos uma CÓPIA do documento para não alterar a lista antes de salvar
    modalRef.componentInstance.tipo = { ...doc };

    modalRef.result
      .then((resultado) => {
        if (resultado) {
          // AGORA SIM chamamos o serviço com o método PUT que você mencionou
          this.documentoService
            .atualizarTipoDocumento(resultado.id, resultado)
            .subscribe({
              next: (docAtualizado) => {
                // Atualiza a linha na tabela com o novo nome vindo do servidor
                doc.nome = docAtualizado.nome;
              },
            });
        }
      })
      .catch(() => {
        // Modal fechado ou cancelado, nada acontece
      });
  }

  excluir(id: number) {
    if (!this.ehAdmin) return;
    if (confirm('Tem certeza que deseja excluir?')) {
      this.documentoService.deletarTipoDocumento(id).subscribe(() => {
        // Remove da lista local sem precisar recarregar tudo do banco
        this.listaDocumentos = this.listaDocumentos.filter((d) => d.id !== id);
      });
    }
  }
}

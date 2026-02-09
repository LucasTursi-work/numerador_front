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
import { BotaoComponent } from '../../components/botao/botao.component';
import { ModalEditarTipoDocComponent } from '../../components/modal-editar-tipo-doc/modal-editar-tipo-doc.component';
import { TipoDocumentoDTO } from '../../shared/dtos/response/documento-response.dto';
import { Status } from '../../shared/enums/documents-enums';

@Component({
  selector: 'app-tabela-documentos',
  standalone: true,
  imports: [CommonModule, BotaoComponent],
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
  listaDocumentos: TipoDocumentoDTO[] = [];

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  carregarDocumentos() {
    this.documentoService.listarTodosTiposDocumentos().subscribe((dados) => {
      this.listaDocumentos = dados;
    });
  }

  toggleStatus(documento: TipoDocumentoDTO) {
    // Define o novo status baseado no atual
    const novoStatus =
      documento.status === Status.ATIVO ? Status.INATIVO : Status.ATIVO;

    this.documentoService
      .alterarStatusTipoDocumento(documento.id, novoStatus)
      .subscribe({
        next: (docAtualizado) => {
          // Atualiza o objeto na lista local para refletir no HTML
          documento.status = docAtualizado.status as Status;
        },
        error: (err) => console.error('Erro ao mudar status', err),
      });
  }

  editar(doc: TipoDocumentoDTO) {
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
    if (confirm('Tem certeza que deseja excluir?')) {
      this.documentoService.deletarTipoDocumento(id).subscribe(() => {
        // Remove da lista local sem precisar recarregar tudo do banco
        this.listaDocumentos = this.listaDocumentos.filter((d) => d.id !== id);
      });
    }
  }
}

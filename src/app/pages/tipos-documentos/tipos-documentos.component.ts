import { Component, OnInit, inject } from '@angular/core';
import { DocumentoService } from '../../modules/documents/services/documents.service';
import { BotaoComponent } from '../../components/botao/botao.component';
import { TipoDocumentoDTO } from '../../shared/dtos/response/documento-response.dto';

@Component({
  selector: 'app-tipos-documentos',
  templateUrl: './tipos-documentos.component.html',
  styleUrls: ['./tipos-documentos.component.css'],
})
export class TiposDocumentosComponent implements OnInit {
  private documentoService = inject(DocumentoService);

  listaDocumentos: TipoDocumentoDTO[] = [];

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  carregarDocumentos() {
    this.documentoService.listarTodosTiposDocumentos().subscribe((dados) => {
      this.listaDocumentos = dados;
    });
  }

  toggleStatus(doc: TipoDocumentoDTO) {
    this.documentoService.atualizarStatus(doc.id, !doc.ativo).subscribe();
  }

  editar(doc: TipoDocumentoDTO) {
    console.log('Editando:', doc);
  }

  excluir(id: number) {
    console.log('Excluindo ID:', id);
  }
}

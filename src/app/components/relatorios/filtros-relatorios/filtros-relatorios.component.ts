import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RelatoriosService } from '../relatorios.service';
import { RelatorioFiltroDTO } from '../../../shared/models/relatorio.model';

@Component({
  selector: 'app-filtros-relatorio',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filtros-relatorios.component.html',
  styleUrls: ['./filtros-relatorios.component.scss']
})
export class FiltrosRelatorioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private relatoriosService = inject(RelatoriosService);

  // Exemplo de listas que viriam de outros services do seu sistema
  tiposDocumento = [{id: 1, nome: 'Opção 1'}, {id: 2, nome: 'Opção 2'}]; 
  cartorios = [{id: 1, nome: '1º Cartório'}, {id: 2, nome: '2º Cartório'}];
  usuarios = [{id: 1, nome: 'Usuário 1'}, {id: 2, nome: 'Usuário 2'}];

  formFiltros = this.fb.group({
    dataInicial: [null],
    dataFinal: [null],
    tiposDocumentoIds: [[] as number[]],
    cartoriosIds: [[] as number[]],
    usuariosIds: [[] as number[]]
  });

  ngOnInit(): void {}

  emitirBusca() {
    const filtros: RelatorioFiltroDTO = this.formFiltros.value as RelatorioFiltroDTO;
    this.relatoriosService.buscarDadosRelatorio(filtros);
  }
}

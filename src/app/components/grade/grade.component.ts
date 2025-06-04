import { Component } from '@angular/core';
import { BotaoComponent } from '../botao/botao.component';
import { CounterComponent } from '../counter/counter.component';

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [BotaoComponent, CounterComponent],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
})
export class GradeComponent {
  documents: Document[] = [
    { id: 1, name: 'CARTA PRECATÓRIA', counter: 0 },
    { id: 2, name: 'ORDEM DE MISSÃO POLICIAL', counter: 0 },
    { id: 3, name: 'GUIA DE RECOLHIMENTO', counter: 0 }
    { id: 4, name: 'OFÍCIO', counter: 0 }
    { id: 5, name: 'VERIFICAÇÃO PRELIMINAR DE INFORMAÇÃO', counter: 0 }
    { id: 6, name: 'RELATÓRIO DE MISSÃO', counter: 0 }
    { id: 7, name: 'COMUNICAÇÃO INTERNA', counter: 0 }
    { id: 8, name: 'DESPACHO', counter: 0 }
    { id: 9, name: 'RELATÓRIO TÉCNICO', counter: 0 }
  ];

  constructor() {
    this.carregarContadores();
  }

  carregarContadores() {
    const contadoresSalvos = localStorage.getItem('documentosContadores');
    if (contadoresSalvos) {
      const contadores = JSON.parse(contadoresSalvos);
      this.documentos.forEach((doc, index) => {
        doc.contador = contadores[index] || 0;
      });
    }
  }

  salvarContadores() {
    const contadores = this.documentos.map(doc => doc.contador);
    localStorage.setItem('documentosContadores', JSON.stringify(contadores));
  }

  gerarDocumento(index: number) {
    this.documentos[index].contador++; // Incrementa
    this.salvarContadores(); // Chama o método que salva no localStorage
  }
}

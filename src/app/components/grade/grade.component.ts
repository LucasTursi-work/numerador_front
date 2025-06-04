import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { BotaoComponent } from '../botao/botao.component';

interface Documento {
  name: string;
  counter: number;
  id: number;
}

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [BotaoComponent],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
})
export class GradeComponent {
  documentos: Documento[] = [
    { id: 1, name: 'CARTA PRECATÓRIA', counter: 0 },
    { id: 2, name: 'ORDEM DE MISSÃO POLICIAL', counter: 0 },
    { id: 3, name: 'GUIA DE RECOLHIMENTO', counter: 0 },
    { id: 4, name: 'OFÍCIO', counter: 0 },
    { id: 5, name: 'VERIFICAÇÃO PRELIMINAR DE INFORMAÇÃO', counter: 0 },
    { id: 6, name: 'RELATÓRIO DE MISSÃO', counter: 0 },
    { id: 7, name: 'COMUNICAÇÃO INTERNA', counter: 0 },
    { id: 8, name: 'DESPACHO', counter: 0 },
    { id: 9, name: 'RELATÓRIO TÉCNICO', counter: 0 },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.carregarContadores();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  carregarContadores() {
    if (!this.isLocalStorageAvailable()) return;

    const contadoresSalvos = localStorage.getItem('documentosContadores');
    if (contadoresSalvos) {
      const contadores = JSON.parse(contadoresSalvos);
      this.documentos.forEach((doc, index) => {
        doc.counter = contadores[index] || 0;
      });
    }
  }

  salvarContadores() {
    if (!this.isLocalStorageAvailable()) return;

    const contadores = this.documentos.map((doc) => doc.counter);
    localStorage.setItem('documentosContadores', JSON.stringify(contadores));
  }

  gerarDocumento(index: number) {
    this.documentos[index].counter++; // Incrementa
    this.salvarContadores(); // Chama o método que salva no localStorage
  }
}

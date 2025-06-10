import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgFor } from '@angular/common';
import { BotaoComponent } from '../botao/botao.component';
import { CommonModule } from '@angular/common';

interface Documento {
  id: number;
  nome: string;
  contador: number;
}

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [BotaoComponent, NgFor], // Usando o componente importado
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
})
export class GradeComponent {
  documentos: Documento[] = [
    { id: 1, nome: 'CARTA PRECATÓRIA', contador: 0 },
    { id: 2, nome: 'ORDEM DE MISSÃO POLICIAL', contador: 0 },
    { id: 3, nome: 'GUIA DE RECOLHIMENTO', contador: 0 },
    { id: 4, nome: 'OFÍCIO', contador: 0 },
    { id: 5, nome: 'VERIFICAÇÃO PRELIMINAR DE INFORMAÇÃO', contador: 0 },
    { id: 6, nome: 'RELATÓRIO DE MISSÃO', contador: 0 },
    { id: 7, nome: 'COMUNICAÇÃO INTERNA', contador: 0 },
    { id: 8, nome: 'DESPACHO', contador: 0 },
    { id: 9, nome: 'RELATÓRIO TÉCNICO', contador: 0 },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (this.isBrowser()) {
      this.carregarContadores();
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private carregarContadores() {
    if (!this.isBrowser()) return;

    try {
      const contadoresSalvos = localStorage.getItem('documentosContadores');
      if (contadoresSalvos) {
        const contadores = JSON.parse(contadoresSalvos);
        this.documentos.forEach((doc, index) => {
          doc.contador = contadores[index] || 0;
        });
      }
    } catch (error) {
      console.error('Erro ao carregar contadores:', error);
    }
  }

  salvarContadores() {
    if (!this.isBrowser()) return;

    try {
      const contadores = this.documentos.map((doc) => doc.contador);
      localStorage.setItem('documentosContadores', JSON.stringify(contadores));
    } catch (error) {
      console.error('Erro ao salvar contadores:', error);
    }
  }

  gerarDocumento(index: number) {
    this.documentos[index].contador++;
    this.salvarContadores();
  }
}

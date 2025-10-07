import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
console.log('STATUS DO CHART.JS: Módulo importado.');

Chart.register(...registerables);
console.log('STATUS DO CHART.JS: Componentes registrados.');

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.scss',
})
export class GraficosComponent implements AfterViewInit {
  // 2. Resolve o erro "Cannot find name 'ctx'"
  // 'meuCanvas' agora é a referência segura ao elemento <canvas #myChart>

  constructor() {}

  // 3. Garante que o gráfico só será criado após o elemento ser renderizado
  ngAfterViewInit(): void {
    // O setTimeout é a solução mais confiável contra falhas de timing do @ViewChild.
    setTimeout(() => {
      this.criarGrafico();
    }, 100);
  }

  criarGrafico(): void {
    // 1. Acessa o elemento DOM e obtém o contexto 2D.
    // O '?' garante que a aplicação não quebre se o 'meuCanvas' for nulo.
    const canvasElement = document.getElementById(
      'myChart'
    ) as HTMLCanvasElement;

    const ctx = canvasElement ? canvasElement.getContext('2d') : null;
    console.log(
      'DIAGNÓSTICO (getElementById): O Contexto 2D (ctx) foi obtido?',
      !!ctx
    );

    if (ctx) {
      console.log('SUCESSO: Contexto 2D pronto. Criando instância Chart.js.');

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // ESSENCIAL para o CSS
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      // Loga o erro se a variável não estiver pronta.
      console.error(
        "FALHA CRÍTICA: Elemento canvas não encontrado/pronto ou getContext('2d') falhou. Verifique o timing do ngAfterViewInit."
      );
    }
  }
}

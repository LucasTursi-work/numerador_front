import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

// 1. Resolve o erro "Cannot find name 'Chart'"
declare var Chart: any;

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  standalone: true,
  styleUrls: ['./graficos.component.scss'],
})
export class GraficosComponent implements AfterViewInit {
  // 2. Resolve o erro "Cannot find name 'ctx'"
  // 'meuCanvas' agora é a referência segura ao elemento <canvas #myChart>
  @ViewChild('myChart') meuCanvas!: ElementRef;

  constructor() {}

  // 3. Garante que o gráfico só será criado após o elemento ser renderizado
  ngAfterViewInit(): void {
    this.criarGrafico();
  }

  criarGrafico(): void {
    // 4. Acessa o elemento DOM e obtém o contexto 2D
    const ctx = this.meuCanvas.nativeElement.getContext('2d');

    // 5. Inicia o gráfico
    if (typeof Chart !== 'undefined' && ctx) {
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
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}

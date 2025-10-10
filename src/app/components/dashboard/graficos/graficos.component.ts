import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

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
  public meuGrafico: Chart | undefined;
  public botaoAtivo: number = 1;

  constructor() {}

  ngAfterViewInit(): void {
    // A criação inicial do gráfico
    setTimeout(() => {
      this.criarGrafico();
    }, 100);
  }

  // Função para o usuário selecionar um novo tipo de gráfico
  selecionarBotao(numero: number): void {
    this.botaoAtivo = numero;
    // CRÍTICO: Chama a função para redesenhar o gráfico após a mudança
    this.criarGrafico();
  }

  criarGrafico(): void {
    const canvasElement = document.getElementById(
      'myChart'
    ) as HTMLCanvasElement;
    const ctx = canvasElement ? canvasElement.getContext('2d') : null;

    console.log('DIAGNÓSTICO: O Contexto 2D (ctx) foi obtido?', !!ctx);

    if (ctx) {
      // 1. Destrói qualquer gráfico anterior para evitar sobreposição
      if (this.meuGrafico) {
        this.meuGrafico.destroy();
      }

      // 3. Prepara a configuração do gráfico (ainda vazia)
      let config: any;

      // 4. Constrói a configuração baseada no botão ativo
      if (this.botaoAtivo === 1) {
        config = {
          type: 'bar',
          data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
              {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                  //usando as cores do projeto
                  '#2A7050',
                  '#008241',
                  '#e3f9f3',
                  '#225b41',
                  '#184430',
                  '#4ec162',
                ], // CORRIGIDO: Usa a variável
                borderColor: '#55a7b2',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
          },
        };
      } else if (this.botaoAtivo === 2) {
        config = {
          type: 'pie',
          data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
              {
                label: '# of Votes',
                data: [300, 50, 100, 40, 120, 80], // Dados diferentes para o gráfico de pizza
                backgroundColor: [
                  // Gráficos de pizza geralmente usam um array de cores
                  '#2A7050',
                  '#008241',
                  '#e3f9f3',
                  '#225b41',
                  '#184430',
                  '#4ec162',
                ],
                borderColor: '#55a7b2',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        };
      }

      // 5. Cria o novo gráfico com a configuração escolhida
      if (config) {
        this.meuGrafico = new Chart(ctx, config);
        console.log('SUCESSO: Gráfico criado/atualizado. Tipo:', config.type);
      }
    } else {
      console.error('FALHA CRÍTICA: Elemento canvas não encontrado/pronto.');
    }
  }
}

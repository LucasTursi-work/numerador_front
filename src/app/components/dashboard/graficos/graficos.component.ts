import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { NumeradorData } from '../numerador-data.dto';
import { NumeradorService } from '../numerador.service';
import { ContagemGraficoDto } from '../contagem-grafico.dto';

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
export class GraficosComponent implements OnInit {
  public meuGrafico: Chart | undefined;
  public botaoAtivo: number = 1;
  public dadosContagem: ContagemGraficoDto[] = [];

  constructor(private numeradorService: NumeradorService) {}

  ngOnInit(): void {
    // Busca os dados do backend
    this.numeradorService.contagens$.subscribe({
      next: (dados: ContagemGraficoDto[]) => {
        // Espera o novo tipo
        this.dadosContagem = dados;

        if (this.meuGrafico || dados.length > 0) {
          this.criarGrafico();
        }
      },
      error: (e: HttpErrorResponse) =>
        console.error('Erro ao buscar dados do Numerador:', e),
    });
  }
  /*
  ngAfterViewInit(): void {
    // A criação inicial do gráfico
    setTimeout(() => {
      this.criarGrafico();
    }, 100);
  }
*/
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

      const labels = this.dadosContagem.map((d) => d.nome);
      const counts = this.dadosContagem.map((d) => d.contagem);

      // 3. Prepara a configuração do gráfico (ainda vazia)
      let config: any;

      // 4. Constrói a configuração baseada no botão ativo
      if (this.botaoAtivo === 1) {
        config = {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: '# of Votes',
                data: counts,
                backgroundColor: [
                  //usando as cores do projeto
                  '#2A7050',
                  '#008241',
                  '#55a7b2',
                  '#225b41',
                  '#87d1e6',
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
            labels: labels,
            datasets: [
              {
                label: '# of Votes',
                data: counts, // Dados diferentes para o gráfico de pizza
                backgroundColor: [
                  // Gráficos de pizza geralmente usam um array de cores
                  '#2A7050',
                  '#008241',
                  '#55a7b2',
                  '#225b41',
                  '#87d1e6',
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

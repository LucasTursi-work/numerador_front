import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatoriosService } from '../relatorios.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-relatorios-output',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './relatorios-output.component.html',
  styleUrls: ['./relatorios-output.component.scss'],
})
export class RelatoriosOutputComponent {
  public relatoriosService = inject(RelatoriosService);

  // Configurações básicas do Chart.js para o Gráfico de Pizza
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  // Helper para transformar o DTO do Back no formato que o Chart.js aceita
  getChartData(dadosGrafico: any[]): ChartConfiguration['data'] {
    return {
      labels: dadosGrafico.map((d) => d.label),
      datasets: [
        {
          data: dadosGrafico.map((d) => d.quantidade),
          backgroundColor: [
            '#E0DEC3',
            '#FFFDB5',
            '#76D7C4',
            '#A3E4D7',
            '#117A65',
            '#148F77',
          ],
        },
      ],
    };
  }

  exportar(formatoRecebido: string) {
    const formato = formatoRecebido as 'pdf' | 'csv';
    // 1. Recupera o último filtro que foi salvo no serviço ao clicar em "Gerar"
    const filtrosAtuais = this.relatoriosService.obterFiltroAtual();

    // Se o usuário não filtrou nada ainda, impede a exportação vazia
    if (!filtrosAtuais) {
      alert('Por favor, gere os dados do relatório na tela antes de exportar.');
      return;
    }

    // 2. Dispara a requisição POST enviando os filtros e o formato escolhido
    this.relatoriosService.baixarArquivo(filtrosAtuais, formato).subscribe({
      next: (blob: Blob) => {
        // 3. Cria um link temporário oculto no navegador para simular o download automático do arquivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Define o nome do arquivo que o usuário vai salvar
        link.download = `relatorio_sistema_numerador.${formato}`;

        // Clica no link via código e limpa o cache do navegador
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao descarregar o ficheiro de relatório:', err);
      },
    });
  }
}

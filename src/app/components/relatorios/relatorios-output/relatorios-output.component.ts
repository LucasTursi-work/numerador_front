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
    const filtrosAtuais = this.relatoriosService.obterFiltroAtual();

    if (!filtrosAtuais) {
      alert('Por favor, gere os dados do relatório na tela antes de exportar.');
      return;
    }

    this.relatoriosService.baixarArquivo(filtrosAtuais, formato).subscribe({
      next: (blob: Blob) => {
        // --- CORREÇÃO AQUI: Define o tipo MIME correto baseado no formato ---
        const mimeType =
          formato === 'pdf' ? 'application/pdf' : 'text/csv;charset=utf-8;';
        const arquivoDefinido = new Blob([blob], { type: mimeType });

        // Cria a URL com o arquivo devidamente tipado
        const url = window.URL.createObjectURL(arquivoDefinido);
        const link = document.createElement('a');
        link.href = url;

        link.download = `relatorio_sistema_numerador.${formato}`;

        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao descarregar o ficheiro de relatório:', err);
      },
    });
  }
}

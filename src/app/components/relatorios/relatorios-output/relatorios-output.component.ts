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
  styleUrls: ['./relatorios-output.component.scss']
})
export class RelatoriosOutputComponent {
  public relatoriosService = inject(RelatoriosService);

  // Configurações básicas do Chart.js para o Gráfico de Pizza
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };

  // Helper para transformar o DTO do Back no formato que o Chart.js aceita
  getChartData(dadosGrafico: any[]): ChartConfiguration['data'] {
    return {
      labels: dadosGrafico.map(d => d.label),
      datasets: [{
        data: dadosGrafico.map(d => d.quantidade),
        backgroundColor: ['#E0DEC3', '#FFFDB5', '#76D7C4', '#A3E4D7', '#117A65', '#148F77']
      }]
    };
  }

  exportar(formato: 'pdf' | 'csv') {
    // Recupera o último filtro aplicado ou passa o estado atual do form se preferir centralizar
    const filtrosAtuais = {}; // Obter do form ou salvar no service ao buscar
    
    this.relatoriosService.baixarArquivo(filtrosAtuais as any, formato).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio-numerador.${formato}`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error(`Erro ao baixar ${formato}`, err)
    });
  }
}
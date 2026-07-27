import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatoriosService } from '../relatorios.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import {
  RelatorioFiltroDTO,
  RelatorioResultadoDTO,
} from '../../../shared/models/relatorio.model';

@Component({
  selector: 'app-relatorios-output',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './relatorios-output.component.html',
  styleUrls: ['./relatorios-output.component.scss'],
})
export class RelatoriosOutputComponent {
  @Input() filtroAtual: RelatorioFiltroDTO | null = null;
  filtrosAtuais: any = {}; 

  public relatoriosService = inject(RelatoriosService);

  // Configurações básicas do Chart.js para o Gráfico de Pizza
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    maintainAspectRatio: true,
  };

  // Helper para transformar o DTO do Back no formato que o Chart.js aceita
  getChartData(dadosGrafico: any[]): ChartConfiguration['data'] {
    return {
      labels: dadosGrafico.map((d) => d.label),
      datasets: [
        {
          data: dadosGrafico.map((d) => d.quantidade),
          backgroundColor: [
                  '#67bec8',
                  '#3C9AA5',
                  '#27656D',
                  '#55a7b2',
                  '#9ED5DC',
                  '#D6EDF0',
          ],
        },
      ],
    };
  }

gerarPdf() {
    // 1. Captura os elementos canvas pelo ID no HTML
    const canvasDocs = document.getElementById('chartDocs') as HTMLCanvasElement;
    const canvasCartorios = document.getElementById('chartCartorios') as HTMLCanvasElement;

    // 2. Extrai a imagem em Base64 (PNG) de cada um
    const imgDocs = canvasDocs ? canvasDocs.toDataURL('image/png') : null;
    const imgCartorios = canvasCartorios ? canvasCartorios.toDataURL('image/png') : null;

    // 3. Monta a VARIÁVEL DTO (objeto com os dados) combinando os filtros com as imagens
    const dtoFiltro: RelatorioFiltroDTO = {
      ...this.filtrosAtuais,
      imagemGraficoDocsBase64: imgDocs,
      imagemGraficoCartoriosBase64: imgCartorios
    };

    // 4. Passa o OBJETO (dtoFiltro) para o serviço
    this.relatoriosService.baixarArquivo(dtoFiltro, 'pdf').subscribe({
      next: (pdfBlob: Blob) => {
        const blobUrl = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'relatorio-producao.pdf';
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (err) => {
        console.error('Erro ao baixar o PDF:', err);
      }
    });
  }


  exportar(formatoRecebido: string): void {
    let imgDocs: string | null = null;
    let imgCartorios: string | null = null;
    const formatoValido = formatoRecebido as 'pdf' | 'csv';

    // Se o usuário selecionou 'pdf', capturamos os canvas dos gráficos
    if (formatoRecebido === 'pdf') {
      const canvasDocs = document.getElementById('chartDocs') as HTMLCanvasElement;
      const canvasCartorios = document.getElementById('chartCartorios') as HTMLCanvasElement;

      if (canvasDocs) {
        imgDocs = canvasDocs.toDataURL('image/png');
      }
      if (canvasCartorios) {
        imgCartorios = canvasCartorios.toDataURL('image/png');
      }
    }

    // Trata o risco de 'undefined' nos filtros
    const filtroBase = this.filtroAtual ? this.filtroAtual : {};

    // Monta o DTO que será enviado ao backend
    const dtoFiltro: RelatorioFiltroDTO = {
      ...filtroBase,
      // Se for CSV, essas variáveis vão como null; se for PDF, vão preenchidas com o Base64
      imagemGraficoDocsBase64: imgDocs,
      imagemGraficoCartoriosBase64: imgCartorios
    }as RelatorioFiltroDTO;

    // Dispara a chamada do service enviando o DTO e o formato ('pdf' ou 'csv')
    this.relatoriosService.baixarArquivo(dtoFiltro, formatoValido).subscribe({
      next: (blobData: Blob) => {
        // Cria o link de download temporário no navegador
        const blobUrl = window.URL.createObjectURL(blobData);
        const a = document.createElement('a');
        a.href = blobUrl;
        
        // Define o nome e a extensão do arquivo com base na seleção
        a.download = `relatorio-producao.${formatoValido}`;
        a.click();
        
        // Libera o objeto da memória
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (err: any) => {
        console.error(`Erro ao baixar o arquivo no formato ${formatoValido}:`, err);
      }
    });
  }
}


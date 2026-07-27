export interface RelatorioFiltroDTO {
  dataInicial: string | null;
  dataFinal: string | null;
  tiposDocumentoIds: number[];
  cartoriosIds: number[];
  usuariosIds: number[];
  imagemGraficoDocsBase64?: string | null;
  imagemGraficoCartoriosBase64?: string | null;
}

export interface GraficoDataDTO {
  label: string;
  quantidade: number;
}

export interface LogRelatorioDTO {
  usuario: string;
  acao: string;
}

export interface RelatorioResultadoDTO {
  graficoDocumentos: GraficoDataDTO[];
  graficoCartorios: GraficoDataDTO[];
  logs: LogRelatorioDTO[];
}
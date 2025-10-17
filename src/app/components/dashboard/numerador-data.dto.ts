export interface TipoDocumento {
  nome: string;
}

export interface NumeradorData {
  // A interrogação indica que 'tipoDocumento' PODE ser null/undefined
  tipoDocumento?: TipoDocumento;
  numero: number;
}

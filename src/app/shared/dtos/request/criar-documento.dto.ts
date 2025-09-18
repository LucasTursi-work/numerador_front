import { TipoDocumento } from '../../interfaces/tipo-documento.interface';
import { Cartorio } from '../../interfaces/cartorio.interface';

export interface CriarDocumentoDto {
  // O ID não é enviado para criação, pois o backend o gera.
  numero: number;
  dataCadastro: string;
  tipoDocumento: TipoDocumento;
  cartorio: Cartorio;
}

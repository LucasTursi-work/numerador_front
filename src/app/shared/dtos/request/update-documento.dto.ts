import { TipoDocumento } from '../../interfaces/tipo-documento.interface';
import { Cartorio } from '../../interfaces/cartorio.interface';
import { Usuario } from '../../interfaces/usuario.interface';

export interface UpdateDocumentoDto {
  idDocumento?: number;
  numero?: number;
  dataCadastro?: string;
  usuario?: Usuario;
  tipoDocumento?: TipoDocumento;
  cartorio?: Cartorio;
}
